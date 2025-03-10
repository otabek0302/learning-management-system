import { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN, ACTIVATION_TOKEN_SECRET, REFRESH_TOKEN } from "../config/config";
import { Secret } from "jsonwebtoken";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { IJwtPayload } from "../@types/auth.types";
import { ISocialAuthRequest, IUser } from "../@types/user.types";
import { getUserById } from "../services/user.service";

import ejs from "ejs";
import jwt from "jsonwebtoken";
import path from "path";
import CatchAsyncErrors from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler";
import User from "../models/user.models";
import sendMail from "../utils/sendMail";
import redis from "../utils/redis";
import cloudinary from "cloudinary";

// Register user
interface IRegister {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
}

export const registerUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password }: IRegister = req.body;

        const isEmailExist = await User.findOne({ email: email });

        if (isEmailExist) {
            return next(new ErrorHandler("User already exist", 400));
        }

        const user: IRegister = { name, email, password };

        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode }
        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);

        try {
            await sendMail({
                email: user.email,
                subject: "Activation Code",
                template: "activation-mail.ejs",
                data
            });

            res.status(201).json({
                success: true,
                message: `Please check your email address: ${user.email} to activate your account.`,
                activationToken: activationToken.token
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Create Activitation Token
interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: IRegister): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({ user, activationCode }, ACTIVATION_TOKEN_SECRET as Secret, {
        expiresIn: "5m",
    });
    return { token, activationCode };
}

// Activate User Account
interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export const activateUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { activation_token, activation_code } = req.body as IActivationRequest;
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
        res.status(201).json({
            success: true,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Login User
interface ILogin {
    email: string;
    password: string;
}

export const loginUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body as ILogin;

        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400));
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        sendToken(user, 200, res);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Logout User
export const logoutUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });

        redis.del(req.user._id.toString());

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Update access token 
export const updateAccessToken = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token as string | undefined;

        if (!refresh_token) {
            return next(new ErrorHandler("Please login to access this resource", 401));
        }

        let decoded: IJwtPayload;

        try {
            decoded = jwt.verify(refresh_token, REFRESH_TOKEN as string) as IJwtPayload;
        } catch (error) {
            return next(new ErrorHandler("Refresh token is not valid or has expired", 401));
        }

        if (!decoded || !decoded.id) {
            return next(new ErrorHandler("Refresh token payload is invalid", 400));
        }

        const session: string | null = await redis.get(decoded.id as string);

        if (!session) {
            return next(new ErrorHandler("Refresh token is not valid or has expired", 401));
        }

        const user = session as unknown as IUser;

        if (!user || !user._id) {
            return next(new ErrorHandler("User session is invalid", 400));
        }

        const accessToken = jwt.sign({ id: user?._id }, ACCESS_TOKEN as string, {
            expiresIn: "5m",
        });

        const refreshToken = jwt.sign({ id: user?._id }, REFRESH_TOKEN as string, {
            expiresIn: "1d",
        });

        req.user = user;

        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);

        // Upload session to Redis
        res.status(200).json({
            success: true,
            accessToken
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// User services
export const getUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;

        getUserById(userId, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Social auth
export const socialAuth = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, avatar } = req.body as ISocialAuthRequest;
        const user = await User.findOne({ email })

        if (!user) {
            const newUser = await User.create({ email, name, avatar })
            sendToken(newUser, 200, res);
        } else {
            sendToken(user, 200, res);
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Updated user info
interface IUpdateUserInfo {
    name?: string;
    email?: string;
    password?: string;
    avatar?: {
        public_id: string;
        url: string;
    };
}

export const updateUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body as IUpdateUserInfo;
        const userId = req.user?._id;
        const user = await User.findById(userId);

        if (email && user) {
            const isEmailExist = await User.findOne({ email });
            if (isEmailExist) {
                return next(new ErrorHandler("Email already exist", 400));
            }
            user.email = email;
        }

        if (name && user) {
            user.name = name;
        }

        await user?.save();

        await redis.set(userId, JSON.stringify(user));

        res.status(200).json({
            success: true,
            user
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Update user password
interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}

export const updatePassword = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body as IUpdatePassword;

        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Please enter old and new password", 400));
        }

        const user = await User.findById(req.user?._id).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        const isPasswordMatch = await user.comparePassword(oldPassword);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Old password is incorrect", 400));
        }

        if (newPassword.length < 8) {
            return next(new ErrorHandler("Password must be at least 8 characters long", 400));
        }

        user.password = newPassword;
        await user.save();

        await redis.set(user._id.toString(), JSON.stringify(user));

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Update user Avatar
interface IUpdateUserAvatar {
    avatar: string;
}

export const updateProfilePicture = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { avatar } = req.body as IUpdateUserAvatar;

        if (!avatar) {
            return next(new ErrorHandler("Please enter avatar", 400));
        }

        const userId = req.user?._id;
        const user = await User.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        if (user?.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
        } else {
            const uploadResponse = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars", width: 150, height: 150, crop: "fill" }); 
            user.avatar = {
                public_id: uploadResponse.public_id,
                url: uploadResponse.secure_url
            };
        }

        await user.save();

        await redis.set(userId, JSON.stringify(user));

        res.status(200).json({
            success: true,
            user
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})
