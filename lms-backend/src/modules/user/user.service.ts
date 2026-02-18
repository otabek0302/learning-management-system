import crypto from "crypto";
import type { IUser, ISignUpByEmail, ISignUpByPhone, IVerifyOtp, IResendOtp, IForgotPassword, IResetPassword, VerificationOtpIdentifier, IUpdateProfile, IUpdatePreferences, ICreateUser, IAdminUpdateUser, IListUsersQuery, ISignInByEmail, ISignInByPhone, ISignOut, IUpdatePassword } from "./user.interface";
import type { RequestUser } from "@shared/types/express.type";
import type { Request } from "express";

import { env } from "@config/env.config";
import { redis } from "@services/redis.service";
import { sendOtpMail, sendForgotPasswordMail } from "@services/mail.service";
import { logger } from "@shared/services/logger.service";
import { sendSms } from "@services/sms.service";
import { sendTelegramMessage } from "@services/tg-bot.service";

import { UserModel } from "./user.model";
import { toUserDTO, type UserDTO } from "./user.mapper";
import { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError, ConflictError, TooManyRequestsError } from "@middlewares/error.handler";

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

  private generateOTP(length = 6): string {
    return String(crypto.randomInt(10 ** (length - 1), 10 ** length - 1));
  }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, "").replace(/^8/, "998");
    return digits.startsWith("998") ? digits : `998${digits}`;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async storeVerificationOTP(data: VerificationOtpIdentifier, otp: string, userId: string, expiresIn: number): Promise<void> {
    const key = data.email ? `verification:otp:email:${this.normalizeEmail(data.email)}` : `verification:otp:phone:${this.normalizePhone(data.phone!)}`;
    await redis.set(key, JSON.stringify({ code: otp, userId }), { ex: expiresIn });
  }

  private async getVerificationOTP(data: VerificationOtpIdentifier): Promise<{ code: string; userId: string } | null> {
    const key = data.email ? `verification:otp:email:${this.normalizeEmail(data.email)}` : `verification:otp:phone:${this.normalizePhone(data.phone!)}`;
    return redis.getJson<{ code: string; userId: string }>(key);
  }

  private async deleteVerificationOTP(data: VerificationOtpIdentifier): Promise<void> {
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

  private async getResendCooldownOTP(data: VerificationOtpIdentifier): Promise<boolean> {
    const key = data.email ? `resend:otp:email:${this.normalizeEmail(data.email)}` : `resend:otp:phone:${this.normalizePhone(data.phone!)}`;
    return redis.hasKey(key);
  }

  private async setResendCooldownOTP(data: VerificationOtpIdentifier, ttlSeconds: number): Promise<void> {
    const key = data.email ? `resend:otp:email:${this.normalizeEmail(data.email)}` : `resend:otp:phone:${this.normalizePhone(data.phone!)}`;
    await redis.set(key, "1", { ex: ttlSeconds });
  }

  // ─── Auth ───────────────────────────────────────────────────────────────
  async signUpByEmail(data: ISignUpByEmail): Promise<UserDTO | { message: string; requiresVerification: true }> {
    // Check if email already exists
    const existing = await UserModel.findOne({ email: this.normalizeEmail(data.email) });
    if (existing) {
      throw new ConflictError("Email already registered. Please sign in.");
    }

    // Create user
    const user = await UserModel.create({
      email: this.normalizeEmail(data.email),
      password: data.password,
      profile: { first_name: data.first_name, last_name: data.last_name },
      security: { is_email_verified: false },
    });

    // Generate and store OTP
    const otp = this.generateOTP();
    await this.storeVerificationOTP({ email: this.normalizeEmail(data.email) }, otp, String(user._id), this.parseTimespanToSeconds("5m"));

    // Send OTP to email
    await sendOtpMail(this.normalizeEmail(data.email), otp, data.first_name);

    // Return user data
    return toUserDTO(user)!;
  }

  async signUpByPhone(data: ISignUpByPhone): Promise<UserDTO | { message: string; requiresVerification: true }> {
    // Check if phone already exists
    const existing = await UserModel.findOne({ phone: this.normalizePhone(data.phone) });
    if (existing) {
      throw new ConflictError("Phone already registered. Please sign in.");
    }

    // Create user
    const user = await UserModel.create({
      phone: this.normalizePhone(data.phone),
      password: data.password,
      profile: { first_name: data.first_name, last_name: data.last_name },
      security: { is_phone_verified: false },
    });

    // Generate and store OTP
    const otp = this.generateOTP();
    await this.storeVerificationOTP({ phone: this.normalizePhone(data.phone) }, otp, String(user._id), this.parseTimespanToSeconds("5m"));

    // Send OTP via SMS (with Telegram fallback on failure)
    const smsResult = await sendSms(this.normalizePhone(data.phone), `Your verification code: ${otp}`);
    if (!smsResult.success) {
      logger.warn({ error: smsResult.error, phone: this.normalizePhone(data.phone) }, "DevSMS failed, trying Telegram fallback");
      // Send OTP via Telegram
      if (env.TG_OTP_CHAT_ID) {
        const tgResult = await sendTelegramMessage(env.TG_OTP_CHAT_ID, `OTP for ${this.normalizePhone(data.phone)}: ${otp}`);
        if (!tgResult.success) {
          throw new BadRequestError(smsResult.error ?? "Failed to send OTP via SMS or Telegram");
        }
      } else {
        throw new BadRequestError(smsResult.error ?? "Failed to send OTP via SMS");
      }
    }

    // Return user data
    return toUserDTO(user)!;
  }

  async verifyOtp(data: IVerifyOtp): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    // Validate input and get stored OTP
    if (!data.email?.trim() && !data.phone?.trim()) {
      throw new BadRequestError("Either email or phone is required");
    }
    // Get stored OTP
    const identifier: VerificationOtpIdentifier = data.email?.trim() ? { email: this.normalizeEmail(data.email.trim()) } : { phone: this.normalizePhone(data.phone!.trim()) };
    const stored = await this.getVerificationOTP(identifier);
    // Check if OTP is valid
    if (!stored) {
      throw new BadRequestError("Invalid or expired OTP");
    }
    // Check OTP
    if (stored.code !== data.code) {
      throw new BadRequestError("Invalid OTP");
    }

    // Verify user and update verification status
    const user = await UserModel.findById(stored.userId).select("+password");
    if (!user) {
      throw new NotFoundError("User not found");
    }
    // Check account status
    if (user.status !== "active") {
      throw new ForbiddenError("Account is not active");
    }
    // Update verification status
    await UserModel.findByIdAndUpdate(stored.userId, { [data.email?.trim() ? "security.is_email_verified" : "security.is_phone_verified"]: true });
    // Delete verification OTP
    await this.deleteVerificationOTP(identifier);

    // Create tokens and store sessions
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    //  Store session data in Redis
    await redis.set(String(user._id), JSON.stringify(this.buildSessionData(user)), { ex: env.JWT_REFRESH_EXPIRES_IN }); // 7 days in seconds
    await redis.set("rt:" + refreshToken, String(user._id), { ex: env.JWT_REFRESH_EXPIRES_IN }); // 3 days in seconds

    // Return user and tokens
    const updated = await UserModel.findById(stored.userId);
    return { user: toUserDTO(updated)!, accessToken, refreshToken };
  }

  async resendOtp(data: IResendOtp): Promise<{ message: string }> {
    // Validate input and find user
    if (!data.email?.trim() && !data.phone?.trim()) throw new BadRequestError("Either email or phone is required");
    const identifier: VerificationOtpIdentifier = data.email?.trim() ? { email: this.normalizeEmail(data.email.trim()) } : { phone: this.normalizePhone(data.phone!.trim()) };
    const user = data.email?.trim() ? await UserModel.findOne({ email: identifier.email }) : await UserModel.findOne({ phone: identifier.phone });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // If already verified, no need to resend
    const isVerified = data.email?.trim() ? user.security?.is_email_verified : user.security?.is_phone_verified;
    if (isVerified) {
      throw new BadRequestError(data.email ? "Email is already verified. Please sign in." : "Phone is already verified. Please sign in.");
    }

    // Check resend cooldown (prevent spam)
    if (await this.getResendCooldownOTP(identifier)) {
      throw new TooManyRequestsError("Please wait before requesting a new code.");
    }

    // Generate new OTP (works for both: active verification resend + expired OTP / unverified user)
    const otp = this.generateOTP();
    await this.storeVerificationOTP(identifier, otp, String(user._id), this.parseTimespanToSeconds("5m")); // 5 minutes in seconds
    await this.setResendCooldownOTP(identifier, this.parseTimespanToSeconds("60")); // 60 seconds in seconds

    // Send OTP via email or SMS
    if (data.email?.trim()) {
      await sendOtpMail(identifier.email!, otp, user.profile?.first_name);
    } else {
      // Send OTP via SMS (with Telegram fallback on failure)
      const smsResult = await sendSms(identifier.phone!, `Your verification code: ${otp}`);
      if (!smsResult.success) {
        logger.warn({ error: smsResult.error, phone: identifier.phone }, "DevSMS failed, trying Telegram fallback");
        // Send OTP via Telegram
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

  async signInByEmail(data: ISignInByEmail, req: Request): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    // Check login attempts rate limit
    if ((await this.getLoginAttempts(this.normalizeEmail(data.email))) >= 5) {
      throw new TooManyRequestsError("Too many login attempts. Please try again later.");
    }

    // Find user and verify password
    const user = await UserModel.findOne({ email: this.normalizeEmail(data.email) }).select("+password");
    if (!user) {
      await this.incrementLoginAttempts(this.normalizeEmail(data.email));
      throw new UnauthorizedError("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      await this.incrementLoginAttempts(this.normalizeEmail(data.email));
      throw new UnauthorizedError("Invalid email or password");
    }

    // Check account status and restrictions
    if (user.security?.account_restricted) {
      throw new ForbiddenError(user.security.restriction_reason ?? "Account is restricted");
    }
    // Check email verification status
    if (!user.security?.is_email_verified) {
      await this.resendOtp({ email: data.email });
      throw new ForbiddenError("Email is not verified. Verification code sent to your email.", { requiresVerification: true });
    }
    // Check account status
    if (user.status !== "active") {
      throw new ForbiddenError("Account is not active");
    }

    // Reset attempts and update activity
    await this.resetLoginAttempts(this.normalizeEmail(data.email));
    const updated = await UserModel.findByIdAndUpdate(user._id, {
      "activity.last_login_at": new Date(),
      "activity.last_login_ip": req.ip ?? req.socket?.remoteAddress,
    });

    // Check if user was updated
    if (!updated) {
      throw new NotFoundError("Failed to update user activity");
    }

    // Create tokens and store sessions
    const accessToken = updated.signAccessToken();
    const refreshToken = updated.signRefreshToken();

    // Store session data in Redis
    await redis.set(String(updated._id), JSON.stringify(this.buildSessionData(updated)), { ex: env.JWT_REFRESH_EXPIRES_IN }); // 7 days in seconds
    await redis.set("rt:" + refreshToken, String(updated._id), { ex: env.JWT_REFRESH_EXPIRES_IN }); // 3 days in seconds

    return { user: toUserDTO(updated)!, accessToken, refreshToken };
  }

  async signInByPhone(data: ISignInByPhone, req: Request): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    // Check login attempts rate limit
    if ((await this.getLoginAttempts(this.normalizePhone(data.phone))) >= 5) {
      throw new TooManyRequestsError("Too many login attempts. Please try again later.");
    }

    // Find user and verify password
    const user = await UserModel.findOne({ phone: this.normalizePhone(data.phone) }).select("+password");
    if (!user) {
      await this.incrementLoginAttempts(this.normalizePhone(data.phone));
      throw new UnauthorizedError("Invalid phone or password");
    }
    // Verify password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      await this.incrementLoginAttempts(this.normalizePhone(data.phone));
      throw new UnauthorizedError("Invalid phone or password");
    }

    // Check account status and restrictions
    if (user.security?.account_restricted) {
      throw new ForbiddenError(user.security.restriction_reason ?? "Account is restricted");
    }
    // Check phone verification status
    if (!user.security?.is_phone_verified) {
      await this.resendOtp({ phone: data.phone });
      throw new ForbiddenError("Phone is not verified. Verification code sent to your phone.", { requiresVerification: true });
    }
    // Check account status
    if (user.status !== "active") {
      throw new ForbiddenError("Account is not active");
    }

    // Reset attempts and update activity
    await this.resetLoginAttempts(this.normalizePhone(data.phone));
    const updated = await UserModel.findByIdAndUpdate(user._id, { "activity.last_login_at": new Date(), "activity.last_login_ip": req.ip ?? req.socket?.remoteAddress });
    if (!updated) {
      throw new NotFoundError("Failed to update user activity");
    }

    // Create tokens and store sessions
    const accessToken = updated.signAccessToken();
    const refreshToken = updated.signRefreshToken();
    // Store session data in Redis
    await redis.set(String(updated._id), JSON.stringify(this.buildSessionData(updated)), { ex: env.JWT_REFRESH_EXPIRES_IN }); // 7 days in seconds
    await redis.set("rt:" + refreshToken, String(updated._id), { ex: env.JWT_REFRESH_EXPIRES_IN }); // 3 days in seconds

    return { user: toUserDTO(updated)!, accessToken, refreshToken };
  }

  async signOut(user: RequestUser, refreshToken?: string): Promise<void> {
    // Delete session and refresh token from Redis
    await redis.del(user._id);
    if (refreshToken) {
      await redis.del("rt:" + refreshToken);
    }
  }

  async forgotPassword(data: IForgotPassword): Promise<{ message: string }> {
    // Normalize email
    const email = this.normalizeEmail(data.email);

    // Find user by email
    const user = await UserModel.findOne({ email: this.normalizeEmail(email) });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const ttl = this.parseTimespanToSeconds("1h"); // 1 hour in seconds
    // Store reset token in Redis
    await redis.set(`password_reset:${token}`, email, { ex: ttl });
    await sendForgotPasswordMail(email, token, user.profile?.first_name);
    return { message: "If an account exists with this email, a password reset link has been sent." };
  }

  async resetPassword(data: IResetPassword): Promise<{ message: string }> {
    // Get email from reset token
    const email = await redis.getString(`password_reset:${data.token}`);
    if (!email) {
      throw new UnauthorizedError("Invalid or expired reset token");
    }
    // Find user by email
    const user = await UserModel.findOne({ email: this.normalizeEmail(email) }).select("+password");
    if (!user) {
      throw new NotFoundError("User not found");
    }
    // Update password
    user.password = data.password;
    await user.save();

    // Delete reset token
    await redis.del(`password_reset:${data.token}`);
    return { message: "Password reset successfully" };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    // Get user ID from refresh token
    const userId = await redis.getString("rt:" + refreshToken);
    if (!userId) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }
    // Find user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    // Check account status and restrictions
    if (user.security?.account_restricted) throw new ForbiddenError("Account is restricted");
    if (user.status !== "active") throw new ForbiddenError("Account is not active");

    // Recreate session so /me and other auth routes work after refresh
    await redis.set(String(user._id), JSON.stringify(this.buildSessionData(user)), { ex: 7 * 24 * 60 * 60 });

    return user.signAccessToken();
  }

  // ─── Profile ────────────────────────────────────────────────────────────
  async getMe(user: RequestUser): Promise<UserDTO | null> {
    // Find user by id (exclude deleted)
    const foundUser = await UserModel.findOne({ _id: user?._id, status: { $ne: "deleted" } });
    if (!foundUser) {
      throw new NotFoundError("User not found");
    }
    return toUserDTO(foundUser);
  }

  async updateProfile(user: RequestUser, data: IUpdateProfile): Promise<UserDTO | null> {
    // Find user by id
    const foundUser = await UserModel.findOne({ _id: user._id, status: { $ne: "deleted" } });
    if (!foundUser) {
      throw new NotFoundError("User not found");
    }
    // Build update object and update user
    const update: Record<string, unknown> = {};
    if (data.first_name !== undefined) update["profile.first_name"] = data.first_name;
    if (data.last_name !== undefined) update["profile.last_name"] = data.last_name;
    if (data.avatar !== undefined) update["profile.avatar"] = data.avatar;
    if (data.age !== undefined) update["profile.age"] = data.age;
    if (data.gender !== undefined) update["profile.gender"] = data.gender;

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, { $set: update }, { new: true });
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }
    return toUserDTO(updatedUser);
  }

  async updatePassword(user: RequestUser, data: IUpdatePassword): Promise<UserDTO | null> {
    // Find user, verify old password, and update
    const foundUser = await UserModel.findById(user._id).select("+password");
    if (!foundUser) {
      throw new NotFoundError("User not found");
    }
    // Verify old password
    const isPasswordValid = await foundUser!.comparePassword(data.oldPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Current password is incorrect");
    }
    // Update password
    foundUser!.password = data.newPassword;
    // Save user
    await foundUser!.save();

    return toUserDTO(foundUser);
  }

  // ─── Preferences ────────────────────────────────────────────────────────
  async updatePreferences(user: RequestUser, data: IUpdatePreferences): Promise<UserDTO | null> {
    // Find user by id
    const foundUser = await UserModel.findOne({ _id: user._id, status: { $ne: "deleted" } });
    if (!foundUser) {
      throw new NotFoundError("User not found");
    }

    // Build update object and update user preferences
    const update: Record<string, unknown> = {};
    if (data.two_factor_authentication_enabled !== undefined) update["preferences.two_factor_authentication_enabled"] = data.two_factor_authentication_enabled;
    if (data.email_notifications_enabled !== undefined) update["preferences.email_notifications_enabled"] = data.email_notifications_enabled;
    if (data.push_notifications_enabled !== undefined) update["preferences.push_notifications_enabled"] = data.push_notifications_enabled;
    if (data.theme !== undefined) update["preferences.theme"] = data.theme;
    if (data.timezone !== undefined) update["preferences.timezone"] = data.timezone;
    if (data.language !== undefined) update["preferences.language"] = data.language;

    // Update user preferences
    const updatedUser = await UserModel.findByIdAndUpdate(foundUser._id, { $set: update }, { new: true });
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }
    return toUserDTO(updatedUser);
  }

  // ─── Student ────────────────────────────────────────────────────────────
  async addToWishlist(user: RequestUser, courseId: string): Promise<void> {
    // Add course to user wishlist
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, { $addToSet: { "student.wishlist": courseId } });
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }
  }

  async removeFromWishlist(user: RequestUser, courseId: string): Promise<void> {
    // Remove course from user wishlist
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, { $pull: { "student.wishlist": courseId } });
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }
  }

  // ─── Security ───────────────────────────────────────────────────────────
  async restrictAccount(userId: string, reason: string): Promise<void> {
    // Update security flags to restrict account
    const user = await UserModel.findByIdAndUpdate(userId, { "security.account_restricted": true, "security.restriction_reason": reason });
    if (!user) {
      throw new NotFoundError("User not found");
    }
  }

  async unrestrictAccount(userId: string): Promise<void> {
    // Clear account restriction
    const user = await UserModel.findByIdAndUpdate(userId, { "security.account_restricted": false, "security.restriction_reason": undefined });
    if (!user) {
      throw new NotFoundError("User not found");
    }
  }

  // ─── Admin ──────────────────────────────────────────────────────────────
  async createUser(data: ICreateUser): Promise<UserDTO> {
    // Check if email or phone already exists
    const existing = await UserModel.findOne({ $or: [{ email: this.normalizeEmail(data.email) }, { phone: this.normalizePhone(data.phone) }] });
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

    // Send verification OTP if requested
    if (data.send_email_verification !== false && data.email) {
      const otp = this.generateOTP();
      await this.storeVerificationOTP({ email: this.normalizeEmail(data.email) }, otp, String(user._id), this.parseTimespanToSeconds("5m"));
      await sendOtpMail(this.normalizeEmail(data.email), otp, data.first_name);
    }
    // Send verification OTP via SMS if requested
    if (data.send_phone_verification !== false && data.phone) {
      const otp = this.generateOTP();
      await this.storeVerificationOTP({ phone: this.normalizePhone(data.phone) }, otp, String(user._id), this.parseTimespanToSeconds("5m"));
      const smsResult = await sendSms(this.normalizePhone(data.phone), `Your verification code: ${otp}`);
      if (!smsResult.success) {
        logger.warn({ error: smsResult.error, phone: this.normalizePhone(data.phone) }, "DevSMS failed, trying Telegram fallback");
        // Send OTP via Telegram
        if (env.TG_OTP_CHAT_ID) {
          const tgResult = await sendTelegramMessage(env.TG_OTP_CHAT_ID, `OTP for ${this.normalizePhone(data.phone)}: ${otp}`);
          if (!tgResult.success) {
            throw new BadRequestError(smsResult.error ?? "Failed to send OTP via SMS or Telegram");
          }
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
    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: update }, { new: true });
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }
    return toUserDTO(updatedUser);
  }

  async deleteUser(userId: string): Promise<void> {
    // Soft delete user
    const deletedUser = await UserModel.findByIdAndUpdate(userId, { status: "deleted", deleted_at: new Date() });
    if (!deletedUser) {
      throw new NotFoundError("User not found");
    }
  }

  async getUserById(userId: string): Promise<UserDTO | null> {
    // Find user by id and return DTO
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return toUserDTO(user);
  }

  async listUsers(options: IListUsersQuery = {}): Promise<{ users: UserDTO[]; total: number }> {
    const { page = 1, limit = 10, search, status } = options;

    // 1. Build a dynamic filter object
    const query: Record<string, unknown> = { status: { $ne: "deleted" } };

    if (search) {
      query.$or = [{ first_name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
    }

    if (status) {
      query.status = status;
    }

    // 2. Execute in parallel for speed
    const [users, total] = await Promise.all([
      UserModel.find(query)
        .sort({ created_at: -1 })
        .skip((page - 1) * limit) // Skip previous pages
        .limit(limit) // Only take current page size
        .lean(),
      UserModel.countDocuments(query), // Count matches for THIS specific query
    ]);

    return {
      users: users.map((u) => toUserDTO(u)!).filter(Boolean),
      total,
    };
  }
}

export const userService = new UserService();
