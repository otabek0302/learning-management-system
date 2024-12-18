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