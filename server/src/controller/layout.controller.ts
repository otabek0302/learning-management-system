import { Request, Response, NextFunction } from "express";
import { Layout as LayoutType } from "../interfaces/layout.interface";

import ErrorHandler from "../utils/ErrorHandler";
import CatchAsyncErrors from "../middleware/catchAsyncErrors";
import { BannerImage } from "../interfaces/layout.interface";
import cloudinary from "cloudinary";
import Layout from "../models/layout.model";


// Create Layout -- Only for Admin
export const createLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get type from body
        const { type } = req.body as LayoutType;

        // Check if type is provided
        if (!type) {
            return next(new ErrorHandler("Type is required", 400));
        }

        // Check if type is valid
        if (type.toLowerCase() !== "banner" && type.toLowerCase() !== "faq" && type.toLowerCase() !== "categories") {
            return next(new ErrorHandler("Invalid type", 400));
        }

        // If type is banner
        if (type.toLowerCase() === "banner") {
            const { title, subTitle, image } = req.body;
            const cloudImage = await cloudinary.v2.uploader.upload(image, {
                folder: "layout",
            }); 
            await Layout.create({ 
                type: "banner",
                banner: { title, subTitle, image: { public_id: cloudImage.public_id, url: cloudImage.url } } 
            });
        }

        // If type is faq
        if (type.toLowerCase() === "faq") {
            const { faq } = req.body;
            await Layout.create({ 
                type: "faq",
                faq 
            });
        }

        // If type is categories
        if (type.toLowerCase() === "categories") {
            const { categories } = req.body;
            await Layout.create({ 
                type: "categories",
                categories 
            });
        }

        // Return success message
        res.status(200).json({
            success: true,
            message: "Layout created successfully",
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Edit Layout -- Only for Admin
export const editLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get type from body
        const { type } = req.body as LayoutType;

        // Check if type is provided
        if (!type) {
            return next(new ErrorHandler("Type is required", 400));
        }

        // Check if type is valid
        if (type.toLowerCase() !== "banner" && type.toLowerCase() !== "faq" && type.toLowerCase() !== "categories") {
            return next(new ErrorHandler("Invalid type", 400));
        }

        // Find existing layout by type
        const existingLayout = await Layout.findOne({ type: type.toLowerCase() });

        if (!existingLayout) {
            return next(new ErrorHandler("Layout not found", 404));
        }

        // If type is banner
        if (type.toLowerCase() === "banner") {
            const { title, subTitle, image } = req.body;
            
            if (image) {
                // Delete old image from cloudinary
                await cloudinary.v2.uploader.destroy(existingLayout.banner.image.public_id);
                
                // Upload new image
                const cloudImage = await cloudinary.v2.uploader.upload(image, { folder: "layout" });
                
                existingLayout.banner = { title, subTitle, image: { public_id: cloudImage.public_id, url: cloudImage.url } as BannerImage };
            } else {
                existingLayout.banner = { ...existingLayout.banner, title, subTitle };
            }
        }

        // If type is faq
        if (type.toLowerCase() === "faq") {
            const { faq } = req.body;
            existingLayout.faq = faq;
        }

        // If type is categories    
        if (type.toLowerCase() === "categories") {
            const { categories } = req.body;
            existingLayout.categories = categories;
        }

        // Save layout
        await existingLayout.save();

        // Return success message
        res.status(200).json({
            success: true,
            message: "Layout updated successfully",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get Layout -- Only for Admin
export const getLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get type from query
        const { type } = req.body as LayoutType;
        
        // Get layout by type
        const layout = await Layout.findOne({ type: type.toLowerCase() });
        
        // If layout is not found, return error
        if (!layout) {
            return next(new ErrorHandler("Layout not found", 404));
        }

        // Return layout
        res.status(200).json({
            success: true,
            layout,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})