// src/middleware/auth.ts

import { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN } from "../config/config";

import CatchAsyncErrors from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from "jsonwebtoken";
import redis from "../utils/redis";
import { IJwtPayload } from "../@types/auth.types";

// Check the user is authenticated or not
export const isAuthenticated = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string | undefined;

    if (!access_token) {
        return next(new ErrorHandler("Please, login to access this resource", 401));
    }

    let decoded: IJwtPayload;

    try {
        decoded = jwt.verify(access_token, ACCESS_TOKEN as string) as IJwtPayload;
    } catch (error) {
        return next(new ErrorHandler("Access token is not valid or has expired", 401));
    }

    if (!decoded) {
        return next(new ErrorHandler("Access token payload is invalid", 400));
    }

    const userData: string | null = await redis.get(decoded.id);

    if (!userData) {
        return next(new ErrorHandler("User not found!", 404));
    }

    try {
        req.user = userData;
    } catch (error) {
        return next(new ErrorHandler("Failed to parse user data", 500));
    }

    next();
});

// Validate the user roles
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role || '')) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }

        next();
    }
}