import { Request, Response, NextFunction } from "express";

import ErrorHandler from "../utils/error-handler";
import CatchAsyncErrors from "../middleware/catch-async-errors";
import generateAnalytics from "../utils/analytics.generator";
import User from "../models/user.model";
import Course from "../models/course.model";
import Order from "../models/order.model";
import { Enrollment } from "../models/enrollment.model";
import { LessonProgress } from "../models/progress.model";
import { QuizResult } from "../models/quiz-result.model";
import { Certificate } from "../models/certificate.model";
import { Coupon } from "../models/coupon.model";


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

export const getRevenueStats = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find({ status: "success" });
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + (order.totalPrice || 0);
        }, 0);

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt || order.get('createdAt') || new Date());
            return orderDate >= monthStart;
        });

        const monthRevenue = monthOrders.reduce((sum, order) => {
            return sum + (order.totalPrice || 0);
        }, 0);

        // Revenue per course
        const revenuePerCourse = await Order.aggregate([
            { $match: { status: "success" } },
            {
                $group: {
                    _id: "$courseId",
                    revenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Populate course details for revenue calculation
        const revenuePerCourseWithDetails = await Promise.all(
            revenuePerCourse.map(async (item) => {
                const course = await Course.findById(item._id);
                return {
                    courseId: item._id,
                    courseName: course?.name || "Unknown",
                    revenue: item.revenue,
                    orderCount: item.count
                };
            })
        );

        res.status(200).json({
            success: true,
            totalRevenue,
            monthRevenue,
            revenuePerCourse: revenuePerCourseWithDetails
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// (B) User Stats
export const getUserStats = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalUsers = await User.countDocuments();

        // New users this month
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const newUsers = await User.countDocuments({
            createdAt: { $gte: monthStart }
        });

        res.status(200).json({
            success: true,
            totalUsers,
            newUsers
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// (C) Course Stats
export const getCourseStats = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();
        const totalCertificates = await Certificate.countDocuments();

        // Top courses by enrollment
        const topCourses = await Enrollment.aggregate([
            { $group: { _id: "$courseId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Populate course names
        const topCoursesWithDetails = await Promise.all(
            topCourses.map(async (item) => {
                const course = await Course.findById(item._id);
                return {
                    courseId: item._id,
                    courseName: course?.name || "Unknown",
                    enrollmentCount: item.count
                };
            })
        );

        res.status(200).json({
            success: true,
            totalCourses,
            totalEnrollments,
            totalCertificates,
            topCourses: topCoursesWithDetails
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// (D) Quiz Stats
export const getQuizStats = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalQuizzes = await QuizResult.countDocuments();

        // Pass rate
        const passedQuizzes = await QuizResult.countDocuments({ passed: true });

        const passRate =
            totalQuizzes === 0 ? 0 : Math.round((passedQuizzes / totalQuizzes) * 100);

        res.status(200).json({
            success: true,
            totalQuizzes,
            passedQuizzes,
            passRate
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// (E) Coupon Stats
export const getCouponStats = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalCoupons = await Coupon.countDocuments();
        const usedCoupons = await Coupon.countDocuments({ usedCount: { $gt: 0 } });

        res.status(200).json({
            success: true,
            totalCoupons,
            usedCoupons
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// (F) Combined Stats Summary Endpoint
export const getAdminDashboardStats = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [
            totalUsers,
            totalCourses,
            totalEnrollments,
            totalCertificates,
            orders,
            totalCoupons,
            totalQuizzes
        ] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Enrollment.countDocuments(),
            Certificate.countDocuments(),
            Order.find({ status: "success" }),
            Coupon.countDocuments(),
            QuizResult.countDocuments()
        ]);

        // Calculate total revenue from successful orders
        const totalRevenue = orders.reduce((sum: number, order) => {
            return sum + (order.totalPrice || 0);
        }, 0);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalCourses,
                totalEnrollments,
                totalCertificates,
                totalRevenue,
                totalCoupons,
                totalQuizzes
            }
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});