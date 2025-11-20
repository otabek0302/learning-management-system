import { Schema, model } from "mongoose";
import { IOrder } from "../interfaces/order.interface";

const orderSchema = new Schema<IOrder>({
    courseId: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
        index: true,
    },
    paymentInfo: {
        type: Object,
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    discountAmount: {
        type: Number,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
    },
    couponCode: {
        type: String,
        default: null,
    },
}, { timestamps: true });

orderSchema.index({ userId: 1 });
orderSchema.index({ courseId: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = model<IOrder>("Order", orderSchema);

export default Order;