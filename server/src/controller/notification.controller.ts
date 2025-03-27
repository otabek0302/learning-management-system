import { Request, Response, NextFunction } from "express"; 

import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import Notification from "../models/notification.model";

// Get All Notifications -- Only for Admin
export const getAllNotifications = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get all notifications
        const notifications = await Notification.find().sort({ createdAt: -1 });

        // Return success response
        res.status(200).json({
            success: true,
            notifications
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Update Notification Status -- Only for Admin
export const updateNotificationStatus = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get notification id from request params
        const { id } = req.params;

        // Update notification status
        const notification = await Notification.findById(id);

        // Check if notification exists
        if (!notification) {
            return next(new ErrorHandler("Notification not found", 404));
        }

        // Update notification status
        notification.status ? notification.status = "read" : notification.status;

        // Save notification
        await notification.save();

        // Get all notifications
        const notifications = await Notification.find().sort({ createdAt: -1 });

        // Return success response
        res.status(200).json({
            success: true,
            notifications
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})
