import cloudinary from "cloudinary";
import fs from "fs";

export const uploadVideoToCloudinary = async (filePath: string): Promise<{
  publicId: string;
  duration: number;
}> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      filePath,
      {
        resource_type: "video",
        folder: "courses/videos",
      },
      (error, result) => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        if (error || !result) return reject(error);
        resolve({
          publicId: result.public_id || "",
          duration: Math.floor(result.duration || 0),
        });
      }
    );
  });
};
