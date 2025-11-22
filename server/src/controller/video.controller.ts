import { Request, Response, NextFunction } from "express";
import CatchAsyncErrors from "../middleware/catch-async-errors";
import ErrorHandler from "../utils/error-handler";
import { uploadVideo } from "../services/cloudinary.service";

export const uploadLessonVideo = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { video } = req.body; // Base64 string or data URI

      if (!video) {
        return next(new ErrorHandler("No video file provided", 400));
      }

      // Upload video to Cloudinary
      const result = await uploadVideo(video, {
        folder: "courses/videos",
      });

      res.status(200).json({
        success: true,
        video: {
          public_id: result.public_id,
          url: result.url,
          secure_url: result.secure_url,
          duration: result.duration,
          format: result.format,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message || "Failed to upload video", 500));
    }
  }
);
