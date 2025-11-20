import { Request, Response, NextFunction } from "express";

import ErrorHandler from "../utils/error-handler";
import catchAsyncErrors from "../middleware/catch-async-errors";
import Notification from "../models/notification.model";
import cron from "node-cron";

// Get All Notifications -- Only for Admin
export const getAllNotifications = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        // Get all notifications
        const notifications = await Notification.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        // Get total count for pagination
        const totalNotifications = await Notification.countDocuments();

        // Return success response
        res.status(200).json({
            success: true,
            notifications,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalNotifications / limit),
                totalNotifications,
                hasMore: totalNotifications > skip + notifications.length
            }
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

// Delete Notification -- Only for Admin
cron.schedule('0 0 0 * * *', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Notification.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } });
});