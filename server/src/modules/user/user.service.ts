import type { IUser, IRegister, IActivationToken, IForgotPasswordToken } from "./user.interface";
import jwt from "jsonwebtoken";
import UserModel from "./user.model";

import { env } from "../../config/env";
import { redisClient } from "../../config/redis";
import { ValidationError } from "../../shared/errors/validation.error";
import { ConflictError } from "../../shared/errors/conflict.error";
import { NotFoundError } from "../../shared/errors/not-found.error";

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async checkUserExists(email: string): Promise<boolean> {
    if (!email?.trim()) {
      throw new ValidationError("Email is required");
    }
    const user = await UserModel.findOne({ email });
    return !!user;
  }

  async validateUserDoesNotExist(email: string): Promise<void> {
    const exists = await this.checkUserExists(email);
    if (exists) {
      throw new ConflictError("User already exists with this email", { email });
    }
  }

  createActivationToken(user: IRegister): IActivationToken {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({ user, activationCode }, env.ACTIVATION_TOKEN_SECRET, { expiresIn: Math.floor((5 * 60 * 1000) / 1000) });
    return { token, activationCode };
  }

  async verifyActivationToken(activation_token: string, activation_code: string): Promise<IUser> {
    try {
      const decoded = jwt.verify(activation_token, env.ACTIVATION_TOKEN_SECRET) as {
        user: IRegister;
        activationCode: string;
      };

      if (decoded.activationCode !== activation_code) {
        throw new ValidationError("Invalid activation code");
      }

      const { email, name, password } = decoded.user;
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        throw new ConflictError("User already exists with this email", { email });
      }

      return await UserModel.create({ email, name, password });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError) {
        throw error;
      }
      throw new ValidationError("Invalid or expired activation token");
    }
  }

  createForgotPasswordToken(user: { name: string; email: string; _id?: string }): IForgotPasswordToken {
    const forgotPasswordCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
      {
        user: {
          name: user.name,
          email: user.email,
          id: user._id,
        },
        forgotPasswordCode,
      },
      env.FORGOT_PASSWORD_TOKEN_SECRET,
      { expiresIn: Math.floor(env.FORGOT_PASSWORD_TOKEN_EXPIRATION / 1000) }
    );
    return { token, forgotPasswordCode };
  }

  async verifyForgotPasswordToken(forgot_password_token: string, forgot_password_code: string): Promise<IUser> {
    try {
      const decoded = jwt.verify(forgot_password_token, env.FORGOT_PASSWORD_TOKEN_SECRET) as {
        user: { name: string; email: string; id?: string };
        forgotPasswordCode: string;
      };

      if (decoded.forgotPasswordCode !== forgot_password_code) {
        throw new ValidationError("Invalid forgot password code");
      }

      const user = await UserModel.findOne({ email: decoded.user.email });
      if (!user) {
        throw new NotFoundError("User");
      }

      return user;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new ValidationError("Invalid or expired forgot password token");
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async updateSession(userId: string, user: IUser, expirationSeconds?: number): Promise<void> {
    const expiration = expirationSeconds || Math.floor(env.REFRESH_TOKEN_EXPIRATION / 1000);
    await redisClient.set(userId, JSON.stringify(user.toObject()), { ex: expiration });
  }

  async deleteSession(userId: string): Promise<void> {
    await redisClient.del(userId);
  }
}

export const userService = UserService.getInstance();

export const checkUserExist = (email: string) => userService.checkUserExists(email);
export const createActivationToken = (user: IRegister) => userService.createActivationToken(user);
export const verifyActivationToken = (token: string, code: string) => userService.verifyActivationToken(token, code);
export const createForgotPasswordToken = (user: { name: string; email: string; _id?: string }) => userService.createForgotPasswordToken(user);
export const verifyForgotPasswordToken = (token: string, code: string) => userService.verifyForgotPasswordToken(token, code);
