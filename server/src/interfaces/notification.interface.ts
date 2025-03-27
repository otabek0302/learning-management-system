import { Document } from "mongoose";

export interface INotification extends Document {
    title: string;
    status: string;
    message: string;
    userId: string;
}

export interface INotificationRequest {
    user: string;
    title: string;
    message: string;
}