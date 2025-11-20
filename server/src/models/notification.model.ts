import { Schema, model } from "mongoose";
import { INotification } from "../interfaces/notification.interface";

const notificationSchema = new Schema<INotification>({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "unread",
    },
}, { timestamps: true });

notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ createdAt: -1 });


const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;