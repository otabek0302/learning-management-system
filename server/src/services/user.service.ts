import { Response, NextFunction } from "express";
import { IActivationToken, IRegister, IForgotPasswordToken, IUpdateUserInfo } from "../interfaces/user.interface";
import { ACTIVATION_TOKEN_SECRET, FORGOT_PASSWORD_TOKEN_SECRET } from "../config/config";
import { Secret } from "jsonwebtoken";

import redis from "../utils/redis";
import User from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from "jsonwebtoken";


// Check user is exist or not
export const checkUserExist = async (email: string, res: Response, next: NextFunction) => {
    if (!email) {
        return next(new ErrorHandler("Email is required", 400));
    }

    const user = await User.findOne({ email });

    if (user) {
        return next(new ErrorHandler("User already exist", 400));
    }
}


// Create activation token
export const createActivationToken = (user: IRegister): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({ user, activationCode }, ACTIVATION_TOKEN_SECRET as Secret, {
        expiresIn: "5m",
    });
    return { token, activationCode };
}

// Verify activation token
export const verifyActivationToken = async (activation_token: string, activation_code: string, res: Response, next: NextFunction) => {
    const newUser: { user: IRegister; activationCode: string } = jwt.verify(activation_token, ACTIVATION_TOKEN_SECRET as string) as { user: IRegister; activationCode: string }

    if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { email, name, password } = newUser.user;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return next(new ErrorHandler("User already exist", 400));
    }

    const user = await User.create({ email, name, password });

    return user;
}

// Create forgot password token
export const createForgotPasswordToken = (user: { name: string; email: string; password: string }): IForgotPasswordToken => {
    const forgotPasswordCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({ user, forgotPasswordCode }, FORGOT_PASSWORD_TOKEN_SECRET as Secret, {
        expiresIn: "5m",
    });
    return { token, forgotPasswordCode };
}

// Verify forgot password token
export const verifyForgotPasswordToken = async (forgot_password_token: string, forgot_password_code: string, res: Response, next: NextFunction) => {
    const newUser: { user: IRegister; forgotPasswordCode: string } = jwt.verify(forgot_password_token, FORGOT_PASSWORD_TOKEN_SECRET as string) as { user: IRegister; forgotPasswordCode: string }

    if (newUser.forgotPasswordCode !== forgot_password_code) {
        return next(new ErrorHandler("Invalid forgot password code", 400));
    }

    const user = await User.findOne({ email: newUser.user.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 400));
    }

    return user;
}

// Get user by id
export const getUserById = async (id: string, res: Response) => {
    const user = await redis.get(id);
    if (user) {
        res.status(200).json({
            success: true,
            user
        });

    } else {
        res.status(404).json({
            success: false,
            message: "User information is not found !"
        });
    }
}