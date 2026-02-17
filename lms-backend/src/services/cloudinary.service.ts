import { v2 as cloudinary } from "cloudinary";

import { cloudinaryConfig } from "@config/cloudinary.config";
import { logger } from "@shared/services/logger.service";

const connectCloudinary = async (): Promise<void> => {
  if (cloudinaryConfig) {
    cloudinary.config(cloudinaryConfig);
  }
  logger.info("Cloudinary connected.");
};

const disconnectCloudinary = async (): Promise<void> => {
  logger.info("Cloudinary disconnected.");
};

export { cloudinary, connectCloudinary, disconnectCloudinary };
export const isCloudinaryConfigured = !!cloudinaryConfig;
