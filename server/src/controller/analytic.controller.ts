import { Request, Response, NextFunction } from "express";

import ErrorHandler from "../utils/ErrorHandler";
import CatchAsyncErrors from "../middleware/catchAsyncErrors";
import generateAnalytics from "../utils/analytics.generator";
import User from "../models/user.model";
import Course from "../models/course.model";
import Order from "../models/order.model";


// Get User's Analytics -- Only for Admin
export const getUserAnalytics = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateAnalytics(User);

        res.status(200).json({
            success: true,
            users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Get Course Analytics -- Only for Admin
export const getCourseAnalytics = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await generateAnalytics(Course);

        res.status(200).json({
            success: true,
            courses
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Get Order Analytics -- Only for Admin
export const getOrderAnalytics = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await generateAnalytics(Order);

        res.status(200).json({
            success: true,
            orders
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})