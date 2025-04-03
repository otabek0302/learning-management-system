import { Request, Response, NextFunction } from "express";
import { sendOrderSuccessEmail } from "../services/order.service";
import { createNotification } from "../services/notification.service";
import { IOrder } from "../interfaces/order.interface";

import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import Order from "../models/order.model";
import Course from "../models/course.model";
import User from "../models/user.model";

// Create Order
export const createOrder = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get course id and payment info from request body 
        const { courseId, paymentInfo } = req.body as IOrder;


        const user = await User.findById(req.user?._id);

        // Check course is exist in user course list
        const courseExistInUserList = user?.courses.some((course: any) => course._id.toString() === courseId);

        // If course is exist in user course list, return error
        if (courseExistInUserList) {
            return next(new ErrorHandler("Course already exist in user course list", 400));
        }

        // Find course by id
        const course = await Course.findById(courseId);

        // If course not found, return error
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        // Create order data
        const orderData = {
            courseId: course._id,
            userId: user?._id,
            paymentInfo
        } as IOrder;

        // Create order
        const order = await Order.create(orderData);

        // Send order success email
        const emailData = {
            _id: course?._id,
            name: course?.name,
            price: course?.price,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }

        // Send order success email
        if (user?.email) {
            sendOrderSuccessEmail(emailData, user.email);
        }

        // Add course to user course list
        user?.courses.push({ _id: course?._id });

        // Save user
        await user?.save();

        // Create Notification
        await createNotification({
            user: user?._id || "",
            title: "New Order",
            message: `You have a new order for ${course?.name}`
        });

        // Course Purchased Notification
        course.purchased ? course.purchased += 1 : course.purchased;

        // Save course
        await course.save();

        // Send response
        res.status(201).json({
            success: true,
            message: "Order created successfully"
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