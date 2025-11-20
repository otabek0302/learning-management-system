import { Request, Response, NextFunction } from "express";
import CatchAsyncErrors from "../middleware/catch-async-errors";
import ErrorHandler from "../utils/error-handler";
import { uploadVideoToCloudinary } from "../services/video.service";

export const uploadLessonVideo = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(new ErrorHandler("No video file uploaded", 400));
    }

    const videoPath = req.file.path;
    const { publicId, duration } = await uploadVideoToCloudinary(videoPath);

    res.status(200).json({
      success: true,
      publicId,
      duration,
    });
  }
);
