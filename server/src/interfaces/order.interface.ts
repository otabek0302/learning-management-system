import { Document } from "mongoose";


export interface IOrder extends Document {
    courseId: string;
    userId: string;
    paymentInfo: object;
    originalPrice: number;
    discountAmount: number;
    totalPrice: number;
    status: "pending" | "success" | "failed";
    couponCode?: string;
    createdAt?: Date;
    updatedAt?: Date;
}