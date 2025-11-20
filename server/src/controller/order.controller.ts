import { Request, Response, NextFunction } from "express";
import { sendOrderSuccessEmail } from "../services/order.service";
import { createNotification } from "../services/notification.service";
import { IOrder } from "../interfaces/order.interface";

import ErrorHandler from "../utils/error-handler";
import catchAsyncErrors from "../middleware/catch-async-errors";
import Order from "../models/order.model";
import Course from "../models/course.model";
import User from "../models/user.model";
import { Enrollment } from "../models/enrollment.model";
import { Coupon } from "../models/coupon.model";

export const createOrder = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler("User not authenticated", 401));
        }

        const { courseId, paymentInfo, couponCode } = req.body;
        if (!courseId) {
            return next(new ErrorHandler("Course ID is required", 400));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const existingEnrollment = await Enrollment.findOne({ userId, courseId, status: "active" });
        if (existingEnrollment) {
            return next(new ErrorHandler("You are already enrolled in this course", 400));
        }

        const courseExistInUserList = user?.courses.some((courseItem: any) => courseItem._id.toString() === courseId);
        if (courseExistInUserList) {
            return next(new ErrorHandler("Course already exist in user course list", 400));
        }
        let originalPrice = course.price;
        let discountAmount = 0;
        let totalPrice = originalPrice;
        let finalCouponCode: string | null = null;

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });

            if (!coupon) {
                return next(new ErrorHandler("Invalid or inactive coupon code", 400));
            }

            if (coupon.expiresAt && coupon.expiresAt < new Date()) {
                return next(new ErrorHandler("Coupon has expired", 400));
            }

            if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
                return next(new ErrorHandler("Coupon usage limit reached", 400));
            }

            discountAmount = (originalPrice * coupon.discountPercentage) / 100;
            totalPrice = Math.max(0, originalPrice - discountAmount);
            finalCouponCode = coupon.code;
            coupon.usedCount += 1;
            await coupon.save();
        }

        const orderData = {
            courseId: course._id.toString(),
            userId: userId?.toString(),
            paymentInfo,
            originalPrice,
            discountAmount,
            totalPrice,
            status: "success" as const,
            couponCode: finalCouponCode || undefined,
        };

        const order = await Order.create(orderData);
        await Enrollment.create({
            userId: userId?.toString() || "",
            courseId: course._id.toString(),
            status: "active",
            purchasedAt: new Date()
        });

        // 9. Add course to user course list
        user?.courses.push({ _id: course?._id });
        await user?.save();

        // 10. Update course purchased count
        course.purchased = (course.purchased || 0) + 1;
        await course.save();

        // 11. Send order success email
        const emailData = {
            _id: course?._id,
            name: course?.name,
            price: totalPrice,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }

        if (user?.email) {
            sendOrderSuccessEmail(emailData, user.email);
        }

        // 12. Create Notification
        await createNotification({
            user: userId?.toString() || "",
            title: "New Order",
            message: `You have a new order for ${course?.name}`
        });

        // 13. Send response
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: {
                _id: order._id,
                courseId: order.courseId,
                originalPrice: order.originalPrice,
                discountAmount: order.discountAmount,
                totalPrice: order.totalPrice,
                status: order.status,
                couponCode: order.couponCode
            }
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Admin Routes
// Get All Orders
export const getAllOrders = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        // Get all orders
        const orders = await Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        // Get total count for pagination
        const totalOrders = await Order.countDocuments();

        // Return success response
        res.status(200).json({
            success: true,
            orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
                hasMore: totalOrders > skip + orders.length
            }
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

