import { INotificationRequest } from "../interfaces/notification.interface";
import Notification from "../models/notification.model";

export const createNotification = async (notificationData: INotificationRequest) => {
    const notification = await Notification.create({
        userId: notificationData.user,
        title: notificationData.title,
        message: notificationData.message,
    });
    return notification;
};
