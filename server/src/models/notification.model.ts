import { Schema, model } from "mongoose";
import { INotification } from "../interfaces/notification.interface";


const notificationSchema = new Schema<INotification>({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "unread",
    }
}, { timestamps: true });


const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;