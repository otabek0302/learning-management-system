import crypto from "crypto";
import type { Types } from "mongoose";
import type { IUser, ISignUpByEmail, ISignUpByPhone, IVerifyOtp, IResendOtp, IForgotPassword, IResetPassword, VerificationOtpIdentifier, IUpdateProfile, IUpdatePreferences, ICreateUser, IAdminUpdateUser, IListUsersQuery } from "./user.interface";
import type { RequestUser } from "@shared/types/express.type";

import { UserModel } from "./user.model";
import { toUserDTO, type UserDTO } from "./user.mapper";
import { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError, ConflictError, TooManyRequestsError } from "@middlewares/error.handler";
import { redis } from "@services/redis.service";
import { sendOtpMail, sendForgotPasswordMail } from "@services/mail.service";
import { logger } from "@shared/services/logger.service";
import { sendSms } from "@services/sms.service";
import { sendTelegramMessage } from "@services/tg-bot.service";
import { env } from "@config/env.config";

class UserService {
  private buildSessionData(user: IUser): { _id: string; email?: string; phone?: string; role: string } {
    return {
      _id: String(user._id),
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────
  private parseTimespanToSeconds(timespan: string): number {
    const match = timespan.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error(`Invalid timespan: ${timespan}. Use e.g. 30s, 5m, 3h, 7d`);
    const value = parseInt(match[1], 10);
    const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
    return value * multipliers[match[2]];
  }

  private generateOtp(length = 6): string {
    return String(crypto.randomInt(10 ** (length - 1), 10 ** length - 1));
  }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, "").replace(/^8/, "998");
    return digits.startsWith("998") ? digits : `998${digits}`;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async storeVerificationOtp(data: VerificationOtpIdentifier, otp: string, userId: string, expiresIn: number): Promise<void> {
    const key = data.email ? `verification:otp:email:${this.normalizeEmail(data.email)}` : `verification:otp:phone:${this.normalizePhone(data.phone!)}`;
    await redis.set(key, JSON.stringify({ code: otp, userId }), { ex: expiresIn });
  }

  private async getVerificationOtp(data: VerificationOtpIdentifier): Promise<{ code: string; userId: string } | null> {
    const key = data.email ? `verification:otp:email:${this.normalizeEmail(data.email)}` : `verification:otp:phone:${this.normalizePhone(data.phone!)}`;
    return redis.getJson<{ code: string; userId: string }>(key);
  }

  private async deleteVerificationOtp(data: VerificationOtpIdentifier): Promise<void> {
    const key = data.email ? `verification:otp:email:${this.normalizeEmail(data.email)}` : `verification:otp:phone:${this.normalizePhone(data.phone!)}`;
    await redis.del(key);
  }

  private async getLoginAttempts(identifier: string): Promise<number> {
    const val = await redis.getString(`login:attempts:${identifier}`);
    return val ? parseInt(val, 10) : 0;
  }

  private async incrementLoginAttempts(identifier: string): Promise<number> {
    const key = `login:attempts:${identifier}`;
    const attempts = await redis.incr(key);
    if (attempts === 1) await redis.expire(key, 900);
    return attempts;
  }

  private async resetLoginAttempts(identifier: string): Promise<void> {
    await redis.del(`login:attempts:${identifier}`);
  }

  private async getResendCooldown(data: VerificationOtpIdentifier): Promise<boolean> {
    const key = data.email ? `resend:otp:email:${this.normalizeEmail(data.email)}` : `resend:otp:phone:${this.normalizePhone(data.phone!)}`;
    return redis.hasKey(key);
  }

  private async setResendCooldown(data: VerificationOtpIdentifier, ttlSeconds: number): Promise<void> {
    const key = data.email ? `resend:otp:email:${this.normalizeEmail(data.email)}` : `resend:otp:phone:${this.normalizePhone(data.phone!)}`;
    await redis.set(key, "1", { ex: ttlSeconds });
  }

  // ─── Auth ───────────────────────────────────────────────────────────────
  async signUpByEmail(data: ISignUpByEmail): Promise<UserDTO | { message: string; requiresVerification: true }> {
    const existing = await UserModel.findOne({ email: this.normalizeEmail(data.email) });
    if (existing) {
      if (existing.security?.is_email_verified) throw new ConflictError("Email already registered. Please sign in.");
      await this.resendOtp({ email: data.email });
      return { message: "Verification code sent to your email", requiresVerification: true };
    }

    // Create user
    const user = await UserModel.create({
      email: this.normalizeEmail(data.email),
      password: data.password,
      profile: { first_name: data.first_name, last_name: data.last_name },
      security: { is_email_verified: false },
    });

    // Generate and store OTP
    const otp = this.generateOtp();
    await this.storeVerificationOtp({ email: this.normalizeEmail(data.email) }, otp, String(user._id), this.parseTimespanToSeconds("5m"));
    
    // Send OTP to email
    await sendOtpMail(this.normalizeEmail(data.email), otp, data.first_name);

    // Return user data
    return toUserDTO(user)!;
  }

  async signUpByPhone(data: ISignUpByPhone): Promise<UserDTO | { message: string; requiresVerification: true }> {
    const existing = await UserModel.findOne({ phone: this.normalizePhone(data.phone) });
    if (existing) {
      if (existing.security?.is_phone_verified) throw new ConflictError("Phone already registered. Please sign in.");
      await this.resendOtp({ phone: data.phone });
      return { message: "Verification code sent to your phone", requiresVerification: true };
    }

    // Create user
    const user = await UserModel.create({
      phone: this.normalizePhone(data.phone),
      password: data.password,
      profile: { first_name: data.first_name, last_name: data.last_name },
      security: { is_phone_verified: false },
    });

    // Generate and store OTP
    const otp = this.generateOtp();
    await this.storeVerificationOtp({ phone: this.normalizePhone(data.phone) }, otp, String(user._id), this.parseTimespanToSeconds("5m"));

    // Send OTP via SMS (with Telegram fallback on failure)
    const smsResult = await sendSms(this.normalizePhone(data.phone), `Your verification code: ${otp}`);
    if (!smsResult.success) {
      logger.warn({ error: smsResult.error, phone: this.normalizePhone(data.phone) }, "DevSMS failed, trying Telegram fallback");
      if (env.TG_OTP_CHAT_ID) {
        const tgResult = await sendTelegramMessage(env.TG_OTP_CHAT_ID, `OTP for ${this.normalizePhone(data.phone)}: ${otp}`);
        if (!tgResult.success) throw new BadRequestError(smsResult.error ?? "Failed to send OTP via SMS or Telegram");
      } else {
        throw new BadRequestError(smsResult.error ?? "Failed to send OTP via SMS");
      }
    }

    // Return user data
    return toUserDTO(user)!;
  }

  async verifyOtp(data: IVerifyOtp): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    // Validate input and get stored OTP
    if (!data.email?.trim() && !data.phone?.trim()) throw new BadRequestError("Either email or phone is required");
    const identifier: VerificationOtpIdentifier = data.email?.trim() ? { email: this.normalizeEmail(data.email.trim()) } : { phone: this.normalizePhone(data.phone!.trim()) };
    const stored = await this.getVerificationOtp(identifier);
    if (!stored) throw new BadRequestError("Invalid or expired OTP");
    if (stored.code !== data.code) throw new BadRequestError("Invalid OTP");

    // Verify user and update verification status
    const user = await UserModel.findById(stored.userId).select("+password");
    if (!user) throw new NotFoundError("User not found");
    if (user.status !== "active") throw new ForbiddenError("Account is not active");
    await UserModel.findByIdAndUpdate(stored.userId, {
      [data.email?.trim() ? "security.is_email_verified" : "security.is_phone_verified"]: true,
    });
    await this.deleteVerificationOtp(identifier);

    // Create tokens and store sessions
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    await redis.set(String(user._id), JSON.stringify(this.buildSessionData(user)), { ex: 7 * 24 * 60 * 60 });
    await redis.set("rt:" + refreshToken, String(user._id), { ex: 3 * 24 * 60 * 60 });

    // Return user and tokens
    const updated = await UserModel.findById(stored.userId);
    return { user: toUserDTO(updated)!, accessToken, refreshToken };
  }

  async resendOtp(data: IResendOtp): Promise<{ message: string }> {
    // Validate input and find user
    if (!data.email?.trim() && !data.phone?.trim()) throw new BadRequestError("Either email or phone is required");
    const identifier: VerificationOtpIdentifier = data.email?.trim() ? { email: this.normalizeEmail(data.email.trim()) } : { phone: this.normalizePhone(data.phone!.trim()) };
    const user = data.email?.trim() ? await UserModel.findOne({ email: identifier.email }) : await UserModel.findOne({ phone: identifier.phone });
    if (!user) throw new NotFoundError("User not found");

    // If already verified, no need to resend
    const isVerified = data.email?.trim() ? user.security?.is_email_verified : user.security?.is_phone_verified;
    if (isVerified) throw new BadRequestError(data.email ? "Email is already verified. Please sign in." : "Phone is already verified. Please sign in.");

    // Check resend cooldown (prevent spam)
    if (await this.getResendCooldown(identifier)) throw new TooManyRequestsError("Please wait before requesting a new code.");

    // Generate new OTP (works for both: active verification resend + expired OTP / unverified user)
    const otp = this.generateOtp();
    await this.storeVerificationOtp(identifier, otp, String(user._id), this.parseTimespanToSeconds("5m"));
    await this.setResendCooldown(identifier, this.parseTimespanToSeconds("60s"));

    // Send OTP via email or SMS
    if (data.email?.trim()) {
      await sendOtpMail(identifier.email!, otp, user.profile?.first_name);
    } else {
      const smsResult = await sendSms(identifier.phone!, `Your verification code: ${otp}`);
      if (!smsResult.success) {
        logger.warn({ error: smsResult.error, phone: identifier.phone }, "DevSMS failed, trying Telegram fallback");
        if (env.TG_OTP_CHAT_ID) {
          const tgResult = await sendTelegramMessage(env.TG_OTP_CHAT_ID, `OTP for ${identifier.phone}: ${otp}`);
          if (!tgResult.success) throw new BadRequestError(smsResult.error ?? "Failed to send OTP via SMS or Telegram");
        } else {
          throw new BadRequestError(smsResult.error ?? "Failed to send OTP via SMS");
        }
      }
    }

    return { message: "Verification code sent" };
  }

  async signInByEmail(email: string, password: string, ip?: string): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    // Check login attempts rate limit
    if ((await this.getLoginAttempts(this.normalizeEmail(email))) >= 5) throw new TooManyRequestsError("Too many login attempts. Please try again later.");

    // Find user and verify password
    const user = await UserModel.findOne({ email: this.normalizeEmail(email) }).select("+password");
    if (!user) {
      await this.incrementLoginAttempts(this.normalizeEmail(email));
      throw new UnauthorizedError("Invalid email or password");
    }
    if (!(await user.comparePassword(password))) {
      await this.incrementLoginAttempts(this.normalizeEmail(email));
      throw new UnauthorizedError("Invalid email or password");
    }

    // Check account status and restrictions
    if (user.security?.account_restricted) throw new ForbiddenError(user.security.restriction_reason ?? "Account is restricted");
    if (!user.security?.is_email_verified) {
      await this.resendOtp({ email });
      throw new ForbiddenError("Email is not verified. Verification code sent to your email.", { requiresVerification: true });
    }
    if (user.status !== "active") throw new ForbiddenError("Account is not active");

    // Reset attempts and update activity
    await this.resetLoginAttempts(this.normalizeEmail(email));
    await UserModel.findByIdAndUpdate(user._id, {
      "activity.last_login_at": new Date(),
      "activity.last_login_ip": ip,
    });

    // Create tokens and store sessions
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    await redis.set(String(user._id), JSON.stringify(this.buildSessionData(user)), { ex: 7 * 24 * 60 * 60 });
    await redis.set("rt:" + refreshToken, String(user._id), { ex: 3 * 24 * 60 * 60 });

    return { user: toUserDTO(user)!, accessToken, refreshToken };
  }

  async signInByPhone(phone: string, password: string, ip?: string): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    // Check login attempts rate limit
    if ((await this.getLoginAttempts(this.normalizePhone(phone))) >= 5) throw new TooManyRequestsError("Too many login attempts. Please try again later.");

    // Find user and verify password
    const user = await UserModel.findOne({ phone: this.normalizePhone(phone) }).select("+password");
    if (!user) {
      await this.incrementLoginAttempts(this.normalizePhone(phone));
      throw new UnauthorizedError("Invalid phone or password");
    }
    if (!(await user.comparePassword(password))) {
      await this.incrementLoginAttempts(this.normalizePhone(phone));
      throw new UnauthorizedError("Invalid phone or password");
    }

    // Check account status and restrictions
    if (user.security?.account_restricted) throw new ForbiddenError(user.security.restriction_reason ?? "Account is restricted");
    if (!user.security?.is_phone_verified) {
      await this.resendOtp({ phone });
      throw new ForbiddenError("Phone is not verified. Verification code sent to your phone.", { requiresVerification: true });
    }
    if (user.status !== "active") throw new ForbiddenError("Account is not active");

    // Reset attempts and update activity
    await this.resetLoginAttempts(this.normalizePhone(phone));
    await UserModel.findByIdAndUpdate(user._id, {
      "activity.last_login_at": new Date(),
      "activity.last_login_ip": ip,
    });

    // Create tokens and store sessions
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    await redis.set(String(user._id), JSON.stringify(this.buildSessionData(user)), { ex: 7 * 24 * 60 * 60 });
    await redis.set("rt:" + refreshToken, String(user._id), { ex: 3 * 24 * 60 * 60 });

    return { user: toUserDTO(user)!, accessToken, refreshToken };
  }

  async signOut(userId: string, refreshToken?: string): Promise<void> {
    // Delete session and refresh token from Redis
    await redis.del(userId);
    if (refreshToken) await redis.del("rt:" + refreshToken);
  }

  async forgotPassword(data: IForgotPassword): Promise<{ message: string }> {
    const email = this.normalizeEmail(data.email);
    const user = await UserModel.findOne({ email });
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const ttl = this.parseTimespanToSeconds("1h");
      await redis.set(`password_reset:${token}`, email, { ex: ttl });
      await sendForgotPasswordMail(email, token, user.profile?.first_name);
    }
    return { message: "If an account exists with this email, a password reset link has been sent." };
  }

  async resetPassword(data: IResetPassword): Promise<{ message: string }> {
    const email = await redis.getString(`password_reset:${data.token}`);
    if (!email) throw new UnauthorizedError("Invalid or expired reset token");
    const user = await UserModel.findOne({ email: this.normalizeEmail(email) }).select("+password");
    if (!user) throw new NotFoundError("User not found");
    user.password = data.password;
    await user.save();
    await redis.del(`password_reset:${data.token}`);
    return { message: "Password reset successfully" };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const userId = await redis.getString("rt:" + refreshToken);
    if (!userId) throw new UnauthorizedError("Invalid or expired refresh token");
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    if (user.security?.account_restricted) throw new ForbiddenError("Account is restricted");
    if (user.status !== "active") throw new ForbiddenError("Account is not active");

    // Recreate session so /me and other auth routes work after refresh
    await redis.set(String(user._id), JSON.stringify(this.buildSessionData(user)), { ex: 7 * 24 * 60 * 60 });

    return user.signAccessToken();
  }

  /** Get user for auth: Redis session first, fallback to DB. Repopulates Redis if missing. */
  async getUserForAuth(userId: string): Promise<RequestUser> {
    const cached = await redis.getJson<RequestUser>(userId);
    if (cached) return cached;

    const user = await UserModel.findOne({ _id: userId, status: { $ne: "deleted" } });
    if (!user) throw new UnauthorizedError("User not found or inactive");

    const sessionData = this.buildSessionData(user);
    await redis.set(String(user._id), JSON.stringify(sessionData), { ex: 7 * 24 * 60 * 60 });
    return sessionData;
  }

  // ─── Profile ────────────────────────────────────────────────────────────
  async getMe(userId: string): Promise<UserDTO | null> {
    // Find user by id (exclude deleted)
    return toUserDTO(await UserModel.findOne({ _id: userId, status: { $ne: "deleted" } }));
  }

  async updateProfile(userId: string, data: IUpdateProfile): Promise<UserDTO | null> {
    // Build update object and update user
    const update: Record<string, unknown> = {};
    if (data.first_name !== undefined) update["profile.first_name"] = data.first_name;
    if (data.last_name !== undefined) update["profile.last_name"] = data.last_name;
    if (data.avatar !== undefined) update["profile.avatar"] = data.avatar;
    if (data.age !== undefined) update["profile.age"] = data.age;
    if (data.gender !== undefined) update["profile.gender"] = data.gender;
    const user = await UserModel.findByIdAndUpdate(userId, { $set: update }, { new: true });
    if (!user) throw new NotFoundError("User not found");
    return toUserDTO(user);
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Find user, verify old password, and update
    const user = await UserModel.findById(userId).select("+password");
    if (!user) throw new NotFoundError("User not found");
    if (!(await user.comparePassword(oldPassword))) throw new UnauthorizedError("Current password is incorrect");
    user.password = newPassword;
    await user.save();
  }

  // ─── Preferences ────────────────────────────────────────────────────────
  async updatePreferences(userId: string, data: IUpdatePreferences): Promise<UserDTO | null> {
    // Build update object and update user preferences
    const update: Record<string, unknown> = {};
    if (data.two_factor_authentication_enabled !== undefined) update["preferences.two_factor_authentication_enabled"] = data.two_factor_authentication_enabled;
    if (data.email_notifications_enabled !== undefined) update["preferences.email_notifications_enabled"] = data.email_notifications_enabled;
    if (data.push_notifications_enabled !== undefined) update["preferences.push_notifications_enabled"] = data.push_notifications_enabled;
    if (data.theme !== undefined) update["preferences.theme"] = data.theme;
    if (data.timezone !== undefined) update["preferences.timezone"] = data.timezone;
    if (data.language !== undefined) update["preferences.language"] = data.language;
    const user = await UserModel.findByIdAndUpdate(userId, { $set: update }, { new: true });
    if (!user) throw new NotFoundError("User not found");
    return toUserDTO(user);
  }

  // ─── Student ────────────────────────────────────────────────────────────
  async addToWishlist(userId: string, courseId: Types.ObjectId): Promise<void> {
    // Add course to user wishlist
    const user = await UserModel.findByIdAndUpdate(userId, { $addToSet: { "student.wishlist": courseId } });
    if (!user) throw new NotFoundError("User not found");
  }

  async removeFromWishlist(userId: string, courseId: Types.ObjectId): Promise<void> {
    // Remove course from user wishlist
    const user = await UserModel.findByIdAndUpdate(userId, { $pull: { "student.wishlist": courseId } });
    if (!user) throw new NotFoundError("User not found");
  }

  // ─── Security ───────────────────────────────────────────────────────────
  async restrictAccount(userId: string, reason: string): Promise<void> {
    // Update security flags to restrict account
    const user = await UserModel.findByIdAndUpdate(userId, {
      "security.account_restricted": true,
      "security.restriction_reason": reason,
    });
    if (!user) throw new NotFoundError("User not found");
  }

  async unrestrictAccount(userId: string): Promise<void> {
    // Clear account restriction
    const user = await UserModel.findByIdAndUpdate(userId, {
      "security.account_restricted": false,
      "security.restriction_reason": undefined,
    });
    if (!user) throw new NotFoundError("User not found");
  }

  // ─── Admin ──────────────────────────────────────────────────────────────
  async createUser(data: ICreateUser): Promise<UserDTO> {
    // Check if email or phone already exists
    const existing = await UserModel.findOne({
      $or: [{ email: this.normalizeEmail(data.email) }, { phone: this.normalizePhone(data.phone) }],
    });
    if (existing) {
      throw new ConflictError(existing.email === this.normalizeEmail(data.email) ? "Email already registered" : "Phone already registered");
    }

    // Create user
    const user = await UserModel.create({
      email: this.normalizeEmail(data.email),
      phone: this.normalizePhone(data.phone),
      password: data.password,
      role: data.role ?? "student",
      profile: { first_name: data.first_name, last_name: data.last_name },
      security: { is_email_verified: false, is_phone_verified: false },
    });

    // Send verification OTPs if requested
    if (data.send_email_verification !== false && data.email) {
      const otp = this.generateOtp();
      await this.storeVerificationOtp({ email: this.normalizeEmail(data.email) }, otp, String(user._id), this.parseTimespanToSeconds("5m"));
      await sendOtpMail(this.normalizeEmail(data.email), otp, data.first_name);
    }
    if (data.send_phone_verification !== false && data.phone) {
      const otp = this.generateOtp();
      await this.storeVerificationOtp({ phone: this.normalizePhone(data.phone) }, otp, String(user._id), this.parseTimespanToSeconds("5m"));
      const smsResult = await sendSms(this.normalizePhone(data.phone), `Your verification code: ${otp}`);
      if (!smsResult.success) {
        logger.warn({ error: smsResult.error, phone: this.normalizePhone(data.phone) }, "DevSMS failed, trying Telegram fallback");
        if (env.TG_OTP_CHAT_ID) {
          const tgResult = await sendTelegramMessage(env.TG_OTP_CHAT_ID, `OTP for ${this.normalizePhone(data.phone)}: ${otp}`);
          if (!tgResult.success) throw new BadRequestError(smsResult.error ?? "Failed to send OTP via SMS or Telegram");
        } else {
          throw new BadRequestError(smsResult.error ?? "Failed to send OTP via SMS");
        }
      }
    }

    return toUserDTO(user)!;
  }

  async updateUser(userId: string, data: IAdminUpdateUser): Promise<UserDTO | null> {
    // Build update object and update user
    const update: Record<string, unknown> = {};
    if (data.first_name !== undefined) update["profile.first_name"] = data.first_name;
    if (data.last_name !== undefined) update["profile.last_name"] = data.last_name;
    if (data.email !== undefined) update.email = this.normalizeEmail(data.email);
    if (data.phone !== undefined) update.phone = this.normalizePhone(data.phone);
    if (data.role !== undefined) update.role = data.role;
    if (data.status !== undefined) update.status = data.status;
    const user = await UserModel.findByIdAndUpdate(userId, { $set: update }, { new: true });
    if (!user) throw new NotFoundError("User not found");
    return toUserDTO(user);
  }

  async deleteUser(userId: string): Promise<void> {
    // Soft delete user
    const user = await UserModel.findByIdAndUpdate(userId, {
      status: "deleted",
      deleted_at: new Date(),
    });
    if (!user) throw new NotFoundError("User not found");
  }

  async getUserById(userId: string): Promise<UserDTO | null> {
    // Find user by id and return DTO
    const user = await UserModel.findById(userId);
    return toUserDTO(user);
  }

  async listUsers(options: IListUsersQuery = {}): Promise<{ users: UserDTO[]; total: number }> {
    // Build filter and return paginated results
    const { page = 1, limit = 20, role, status, search } = options;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    else filter.status = { $ne: "deleted" };
    if (role) filter.role = role;
    if (search) {
      filter.$or = [{ email: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }, { "profile.first_name": { $regex: search, $options: "i" } }, { "profile.last_name": { $regex: search, $options: "i" } }];
    }
    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ created_at: -1 })
        .lean(),
      UserModel.countDocuments(filter),
    ]);
    return { users: users.map((u) => toUserDTO(u)!).filter(Boolean), total };
  }
}

export const userService = new UserService();
