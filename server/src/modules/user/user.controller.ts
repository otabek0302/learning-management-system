import type { Request, Response } from "express";
import type { IRegister, ISocialAuthRequest, IUpdatePassword, IUpdateUserInfo, IUpdateUserAvatar, IResetPassword, IUpdateUserRole, IDeleteUser } from "./user.interface";

import { AsyncFunction } from "../../middleware/async.middleware";
import { generateTokens } from "../../utils/generate-tokens";
import { verifyRefreshToken } from "../../utils/verify-tokens";
import { emailService } from "../../services/send-mails.service";
import { uploadImage, deleteFile } from "../../services/cloudinary.service";
import { redisClient } from "../../config/redis";
import { userService, createActivationToken, verifyActivationToken, createForgotPasswordToken, verifyForgotPasswordToken } from "./user.service";
import { AuthenticationError, NotFoundError, ConflictError, ValidationError } from "../../shared/errors";
import UserModel from "./user.model";

export const registerUser = AsyncFunction(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as IRegister;

  await userService.validateUserDoesNotExist(email);

  const activationToken = createActivationToken({ name, email, password });

  await emailService.sendMail({
    email,
    subject: "Activation Code",
    template: "activation-mail.ejs",
    data: { user: { name }, activationCode: activationToken.activationCode },
  });

  res.status(201).json({
    success: true,
    message: `Please check your email address: ${email} to activate your account.`,
    activationToken: activationToken.token,
  });
});

export const activateUser = AsyncFunction(async (req: Request, res: Response) => {
  const { activation_token, activation_code } = req.body;

  const user = await verifyActivationToken(activation_token, activation_code);

  res.status(201).json({
    success: true,
    message: `User created successfully with email ${user.email}`,
  });
});

export const loginUser = AsyncFunction(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new AuthenticationError("Invalid email or password");
  }

  await generateTokens(user, 200, res);
});

export const logoutUser = AsyncFunction(async (req: Request, res: Response) => {
  res.cookie("access_token", "", { maxAge: 1 });
  res.cookie("refresh_token", "", { maxAge: 1 });

  if (req.user?._id) {
    await userService.deleteSession(req.user._id.toString());
  }

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const updateAccessToken = AsyncFunction(async (req: Request, res: Response) => {
  const refresh_token = req.cookies.refresh_token as string | undefined;
  if (!refresh_token) {
    throw new AuthenticationError("Please login to access this resource");
  }

  const decoded = verifyRefreshToken(refresh_token);
  const user = await UserModel.findById(decoded.id);
  
  if (!user) {
    throw new AuthenticationError("User not found");
  }

  await generateTokens(user, 200, res);
});

export const getUserInfo = AsyncFunction(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AuthenticationError("User not authenticated");
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const socialAuth = AsyncFunction(async (req: Request, res: Response) => {
  const { email, name, avatar } = req.body as ISocialAuthRequest;
  const user = await userService.findByEmail(email);

  if (!user) {
    const newUser = await UserModel.create({ email, name, avatar });
    await generateTokens(newUser, 200, res);
  } else {
    await generateTokens(user, 200, res);
  }
});

export const updateUserInfo = AsyncFunction(async (req: Request, res: Response) => {
  const { name, email, avatar } = req.body as IUpdateUserInfo;

  if (!name && !email && !avatar) {
    throw new ValidationError("At least one field must be provided");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new AuthenticationError("User not authenticated");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundError("User");
  }

  if (email) user.email = email;
  if (name) user.name = name;

  if (user.avatar?.public_id && avatar) {
    await deleteFile(user.avatar.public_id, "image");
  }

  if (avatar && typeof avatar === "string") {
    const uploadResponse = await uploadImage(avatar, {
      folder: "avatars",
      width: 150,
      height: 150,
      crop: "fill",
    });
    user.avatar = {
      public_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
    };
  }

  await user.save();
  await userService.updateSession(userId.toString(), user);

  res.status(200).json({
    success: true,
    message: "User info updated successfully",
    user,
  });
});

export const updatePassword = AsyncFunction(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body as IUpdatePassword;

  const userId = req.user?._id;
  if (!userId) {
    throw new AuthenticationError("User not authenticated");
  }

  const user = await UserModel.findById(userId).select("+password");
  if (!user) {
    throw new NotFoundError("User");
  }

  const isPasswordMatch = await user.comparePassword(oldPassword);
  if (!isPasswordMatch) {
    throw new ValidationError("Old password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  await userService.updateSession(userId.toString(), user);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

export const updateProfilePicture = AsyncFunction(async (req: Request, res: Response) => {
  const { avatar } = req.body as IUpdateUserAvatar;

  const userId = req.user?._id;
  if (!userId) {
    throw new AuthenticationError("User not authenticated");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundError("User");
  }

  if (user.avatar?.public_id) {
    await deleteFile(user.avatar.public_id, "image");
  }

  const uploadResponse = await uploadImage(avatar, {
    folder: "avatars",
    width: 150,
    height: 150,
    crop: "fill",
  });

  user.avatar = {
    public_id: uploadResponse.public_id,
    url: uploadResponse.secure_url,
  };

  await user.save();
  await userService.updateSession(userId.toString(), user);

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    user,
  });
});

export const forgotPassword = AsyncFunction(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) {
    throw new NotFoundError("User");
  }

  const forgotPasswordToken = createForgotPasswordToken(user);
  const forgotPasswordCode = forgotPasswordToken.forgotPasswordCode;

  await emailService.sendMail({
    email: user.email,
    subject: "Forgot Password",
    template: "forgot-password-mail.ejs",
    data: { user: { name: user.name }, forgotPasswordCode },
  });

  res.status(200).json({
    success: true,
    message: `Please check your email address: ${user.email} to reset your password.`,
    forgotPasswordToken: forgotPasswordToken.token,
  });
});

export const verifyForgotPasswordCode = AsyncFunction(async (req: Request, res: Response) => {
  const { forgot_password_token, forgot_password_code } = req.body;

  const user = await verifyForgotPasswordToken(forgot_password_token, forgot_password_code);

  const resetKey = `password-reset-${user._id}`;
  await redisClient.set(resetKey, JSON.stringify(user.toObject()), { ex: 300 });

  res.status(200).json({
    success: true,
    message: "Forgot password code verified successfully",
    resetKey,
  });
});

export const resetPassword = AsyncFunction(async (req: Request, res: Response) => {
  const { password, resetKey } = req.body as IResetPassword;

  const userJson = await redisClient.get<string>(resetKey);
  if (!userJson) {
    throw new ValidationError("Password reset session expired or invalid");
  }

  const userInfo = typeof userJson === "string" ? JSON.parse(userJson) : userJson;
  const user = await UserModel.findById(userInfo._id).select("+password");

  if (!user) {
    throw new NotFoundError("User");
  }

  user.password = password;
  await user.save();

  await redisClient.del(resetKey);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

export const getAllUsers = AsyncFunction(async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || "1");
  const limit = parseInt((req.query.limit as string) || "12");
  const skip = (page - 1) * limit;

  const query = { _id: { $ne: req.user?._id } };
  const totalUsers = await UserModel.countDocuments(query);
  const users = await UserModel.find(query).select("-password").lean().sort({ createdAt: -1 }).skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      hasMore: totalUsers > skip + users.length,
    },
  });
});

export const fetchUserById = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await UserModel.findById(id).select("-password").lean();
  if (!user) {
    throw new NotFoundError("User", id);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.body as IDeleteUser;

  const user = await UserModel.findById(id);
  if (!user) {
    throw new NotFoundError("User", id);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const updateUserRole = AsyncFunction(async (req: Request, res: Response) => {
  const { id, role } = req.body as IUpdateUserRole;

  const user = await UserModel.findById(id);
  if (!user) {
    throw new NotFoundError("User", id);
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
  });
});

export const createUser = AsyncFunction(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  await userService.validateUserDoesNotExist(email);

  const user = await UserModel.create({
    name,
    email,
    password,
    role: role || "user",
    isVerified: true,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  });
});

export const updateUser = AsyncFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role, isVerified } = req.body;

  const user = await UserModel.findById(id);
  if (!user) {
    throw new NotFoundError("User", id);
  }

  if (email && email !== user.email) {
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists", { email });
    }
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (typeof isVerified === "boolean") user.isVerified = isVerified;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});
