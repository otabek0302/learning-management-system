import { Request, Response, NextFunction } from "express";
import CatchAsyncErrors from "../middleware/catch-async-errors";
import ErrorHandler from "../utils/error-handler";
import { Coupon } from "../models/coupon.model";
import Course from "../models/course.model";

export const createCoupon = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, discountPercentage, maxUses, expiresAt } = req.body;
    const exists = await Coupon.findOne({ code });
    if (exists) return next(new ErrorHandler("Coupon already exists", 400));

    const coupon = await Coupon.create({
      code,
      discountPercentage,
      maxUses,
      expiresAt,
    });

    res.status(201).json({ success: true, coupon });
  }
);

export const getCoupons = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  }
);

export const applyCoupon = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { couponCode, courseId } = req.body;
    const userId = req.user?._id;

    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon || !coupon.active) {
      return next(new ErrorHandler("Invalid coupon code", 400));
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return next(new ErrorHandler("Coupon expired", 400));
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return next(new ErrorHandler("Coupon usage limit reached", 400));
    }

    const course = await Course.findById(courseId);
    if (!course) return next(new ErrorHandler("Course not found", 404));

    const originalPrice = course.price;
    const discount = (originalPrice * coupon.discountPercentage) / 100;
    const finalPrice = Math.max(0, originalPrice - discount);

    res.status(200).json({
      success: true,
      originalPrice,
      discountPercentage: coupon.discountPercentage,
      discountAmount: discount,
      finalPrice,
    });
  }
);
