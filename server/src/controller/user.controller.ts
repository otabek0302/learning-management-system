import { Request, Response, NextFunction } from "express";
import { ACTIVATION_TOKEN_SECRET } from "../config/config";
import { Secret } from "jsonwebtoken";

import ejs from "ejs";
import jwt from "jsonwebtoken";
import path from "path";
import CatchAsyncErrors from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler";
import User from "../models/user.models";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";


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

export const resgisterUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
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

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})