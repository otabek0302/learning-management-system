import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../utils/error-handler";

// Video upload options
interface VideoUploadOptions {
  folder?: string;
  resource_type?: "video" | "image" | "auto";
  public_id?: string;
  overwrite?: boolean;
  invalidate?: boolean;
}

// Image upload options
interface ImageUploadOptions {
  folder?: string;
  width?: number;
  height?: number;
  crop?: string;
  resource_type?: "image" | "auto";
  public_id?: string;
  overwrite?: boolean;
  invalidate?: boolean;
}

// Video upload result
export interface VideoUploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  duration: number;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  created_at: string;
}

// Image upload result
export interface ImageUploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

/**
 * Upload video to Cloudinary from base64 string or buffer
 * @param file - Base64 string (with or without data URI prefix) or buffer
 * @param options - Upload options
 * @returns Video upload result
 */
export const uploadVideo = async (
  file: string | Buffer,
  options: VideoUploadOptions = {}
): Promise<VideoUploadResult> => {
  try {
    const uploadOptions: any = {
      resource_type: "video" as const,
      folder: options.folder || "courses/videos",
      public_id: options.public_id,
      overwrite: options.overwrite || false,
      invalidate: options.invalidate || true,
    };

    let uploadSource: any;

    if (Buffer.isBuffer(file)) {
      // If it's a buffer, upload directly
      uploadSource = file;
    } else {
      // If it's a string, check if it's a base64 data URI or just base64
      if (file.startsWith('data:')) {
        // Data URI format: data:video/mp4;base64,<base64string>
        uploadSource = file;
      } else {
        // Assume it's just base64 string, convert to data URI
        // Try to determine format from options or default to mp4
        const format = options.resource_type === "video" ? "mp4" : "mp4";
        uploadSource = `data:video/${format};base64,${file}`;
      }
    }

    const result = await cloudinary.uploader.upload(uploadSource, uploadOptions);

    if (!result || !result.public_id) {
      throw new Error("Failed to upload video to Cloudinary");
    }

    return {
      public_id: result.public_id,
      url: result.url || "",
      secure_url: result.secure_url || "",
      duration: Math.floor(result.duration || 0),
      format: result.format || "mp4",
      width: result.width,
      height: result.height,
      bytes: result.bytes || 0,
      created_at: result.created_at || new Date().toISOString(),
    };
  } catch (error: any) {
    throw new ErrorHandler(
      `Video upload failed: ${error.message || "Unknown error"}`,
      500
    );
  }
};

/**
 * Upload image to Cloudinary from base64 string or buffer
 * @param file - Base64 string (with or without data URI prefix) or buffer
 * @param options - Upload options
 * @returns Image upload result
 */
export const uploadImage = async (
  file: string | Buffer,
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult> => {
  try {
    const uploadOptions: any = {
      folder: options.folder || "images",
      public_id: options.public_id,
      overwrite: options.overwrite || false,
      invalidate: options.invalidate || true,
    };

    // Add image transformations if provided
    if (options.width || options.height || options.crop) {
      uploadOptions.width = options.width;
      uploadOptions.height = options.height;
      uploadOptions.crop = options.crop || "fill";
    }

    let uploadSource: any;

    if (Buffer.isBuffer(file)) {
      // If it's a buffer, upload directly
      uploadSource = file;
    } else {
      // If it's a string, check if it's a base64 data URI or just base64
      if (file.startsWith('data:')) {
        // Data URI format: data:image/jpeg;base64,<base64string>
        uploadSource = file;
      } else {
        // Assume it's just base64 string, convert to data URI
        uploadSource = `data:image/jpeg;base64,${file}`;
      }
    }

    const result = await cloudinary.uploader.upload(uploadSource, uploadOptions);

    if (!result || !result.public_id) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    return {
      public_id: result.public_id,
      url: result.url || "",
      secure_url: result.secure_url || "",
      width: result.width || 0,
      height: result.height || 0,
      format: result.format || "jpg",
      bytes: result.bytes || 0,
      created_at: result.created_at || new Date().toISOString(),
    };
  } catch (error: any) {
    throw new ErrorHandler(
      `Image upload failed: ${error.message || "Unknown error"}`,
      500
    );
  }
};

/**
 * Delete file from Cloudinary
 * @param publicId - Public ID of the file to delete
 * @param resourceType - Resource type (video, image, raw, auto)
 * @returns Deletion result
 */
export const deleteFile = async (
  publicId: string,
  resourceType: "video" | "image" | "raw" | "auto" = "auto"
): Promise<{ result: string }> => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for deletion");
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Failed to delete file: ${result.result}`);
    }

    return { result: result.result };
  } catch (error: any) {
    throw new ErrorHandler(
      `File deletion failed: ${error.message || "Unknown error"}`,
      500
    );
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param publicIds - Array of public IDs to delete
 * @param resourceType - Resource type (video, image, raw, auto)
 * @returns Deletion results
 */
export const deleteFiles = async (
  publicIds: string[],
  resourceType: "video" | "image" | "raw" | "auto" = "auto"
): Promise<{ deleted: string[]; not_found: string[] }> => {
  try {
    if (!publicIds || publicIds.length === 0) {
      return { deleted: [], not_found: [] };
    }

    // If resourceType is "auto", we need to try deleting as both video and image
    // Cloudinary's delete_resources doesn't support "auto", so we'll try both
    if (resourceType === "auto") {
      const results = {
        deleted: [] as string[],
        not_found: [] as string[],
      };

      // Try to delete as videos first
      try {
        const videoResult = await cloudinary.api.delete_resources(publicIds, {
          resource_type: "video",
          invalidate: true,
        });
        if (videoResult.deleted) {
          results.deleted.push(...Object.keys(videoResult.deleted));
        }
        if (videoResult.not_found) {
          results.not_found.push(...videoResult.not_found);
        }
      } catch (videoError: any) {
        // If video deletion fails, try images
        // This is expected if some files are images
      }

      // Try to delete remaining files as images
      const remainingIds = publicIds.filter(
        (id) => !results.deleted.includes(id) && !results.not_found.includes(id)
      );
      if (remainingIds.length > 0) {
        try {
          const imageResult = await cloudinary.api.delete_resources(remainingIds, {
            resource_type: "image",
            invalidate: true,
          });
          if (imageResult.deleted) {
            results.deleted.push(...Object.keys(imageResult.deleted));
          }
          if (imageResult.not_found) {
            results.not_found.push(...imageResult.not_found);
          }
        } catch (imageError: any) {
          // If image deletion also fails, log but don't throw
          // Some files might already be deleted or not exist
        }
      }

      return results;
    } else {
      // For specific resource types, use the standard approach
      const result = await cloudinary.api.delete_resources(publicIds, {
        resource_type: resourceType,
        invalidate: true,
      });

      return {
        deleted: result.deleted ? Object.keys(result.deleted) : [],
        not_found: result.not_found || [],
      };
    }
  } catch (error: any) {
    // Log the full error for debugging
    console.error("Cloudinary delete error:", error);
    throw new ErrorHandler(
      `Bulk file deletion failed: ${error.message || error.http_code || "Unknown error"}`,
      500
    );
  }
};

/**
 * Generate secure signed URL for video
 * @param publicId - Public ID of the video
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Secure signed URL
 */
export const generateSecureVideoUrl = (
  publicId: string,
  expiresIn: number = 3600
): string => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for secure URL generation");
    }

    const url = cloudinary.url(publicId, {
      resource_type: "video",
      secure: true,
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    });

    return url;
  } catch (error: any) {
    throw new ErrorHandler(
      `Secure URL generation failed: ${error.message || "Unknown error"}`,
      500
    );
  }
};

/**
 * Get file information from Cloudinary
 * @param publicId - Public ID of the file
 * @param resourceType - Resource type (video, image, raw, auto)
 * @returns File information
 */
export const getFileInfo = async (
  publicId: string,
  resourceType: "video" | "image" | "raw" | "auto" = "auto"
): Promise<any> => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required");
    }

    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error: any) {
    throw new ErrorHandler(
      `Failed to get file info: ${error.message || "Unknown error"}`,
      500
    );
  }
};

