import type { UploadApiResponse, UploadApiOptions } from "cloudinary";
import type { VideoUploadOptions, ImageUploadOptions, VideoUploadResult, ImageUploadResult, ResourceType, DeleteResourcesResponse } from "../shared/interfaces/cloudinary.interface";
import { cloudinaryClient } from "../config/cloudinary";
import { ExternalServiceError } from "../shared/errors/external-service.error";
import { ValidationError } from "../shared/errors/validation.error";

const DEFAULT_VIDEO_FOLDER = "courses/videos";
const DEFAULT_IMAGE_FOLDER = "courses/images";
const DEFAULT_CHUNK_SIZE = 6000000;

/**
 * Cloudinary Service Class
 */
export class CloudinaryService {
  private static instance: CloudinaryService;

  private constructor() {}

  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  /** Transform Cloudinary video upload response */
  private transformVideoResult(result: UploadApiResponse): VideoUploadResult {
    if (!result.public_id) {
      throw new ExternalServiceError("Cloudinary", "Invalid Cloudinary response: missing public_id", { error: result });
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
  }

  /** Transform Cloudinary image upload response */
  private transformImageResult(result: UploadApiResponse): ImageUploadResult {
    if (!result.public_id) {
      throw new ExternalServiceError("Cloudinary", "Invalid Cloudinary response: missing public_id", { error: result });
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
  }

  /** Upload video to Cloudinary */
  public async uploadVideo(file: string | Buffer, options: VideoUploadOptions = {}): Promise<VideoUploadResult> {
    try {
      if (!file || (typeof file === "string" && file.trim().length === 0)) {
        throw new ValidationError("File is required for video upload");
      }

      const cloudinary = cloudinaryClient();
      const uploadOptions: UploadApiOptions = {
        resource_type: "video",
        folder: options.folder || DEFAULT_VIDEO_FOLDER,
        public_id: options.public_id,
        overwrite: options.overwrite ?? false,
        invalidate: options.invalidate ?? true,
        chunk_size: DEFAULT_CHUNK_SIZE,
      };

      const uploadSource = Buffer.isBuffer(file) ? `data:video/mp4;base64,${file.toString("base64")}` : file;
      const result = await cloudinary.uploader.upload(uploadSource, uploadOptions);
      return this.transformVideoResult(result);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof ExternalServiceError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new ExternalServiceError("Cloudinary", `Video upload failed: ${message}`, { error });
    }
  }

  /** Upload image to Cloudinary */
  public async uploadImage(file: string | Buffer, options: ImageUploadOptions = {}): Promise<ImageUploadResult> {
    try {
      if (!file || (typeof file === "string" && file.trim().length === 0)) {
        throw new ValidationError("File is required for image upload");
      }

      const cloudinary = cloudinaryClient();
      const uploadOptions: UploadApiOptions = {
        resource_type: "image",
        folder: options.folder || DEFAULT_IMAGE_FOLDER,
        public_id: options.public_id,
        overwrite: options.overwrite ?? false,
        invalidate: options.invalidate ?? true,
      };

      if (options.width || options.height || options.crop) {
        uploadOptions.width = options.width;
        uploadOptions.height = options.height;
        uploadOptions.crop = (options.crop as "fill" | "fit" | "scale" | "crop" | "thumb") || "fill";
      }

      const uploadSource = Buffer.isBuffer(file) ? `data:image/jpeg;base64,${file.toString("base64")}` : file;
      const result = await cloudinary.uploader.upload(uploadSource, uploadOptions);
      return this.transformImageResult(result);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof ExternalServiceError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new ExternalServiceError("Cloudinary", `Image upload failed: ${message}`, { error });
    }
  }

  /** Delete file from Cloudinary */
  public async deleteFile(publicId: string, resourceType: ResourceType = "auto"): Promise<{ result: string }> {
    try {
      if (!publicId || typeof publicId !== "string" || publicId.trim().length === 0) {
        throw new ValidationError("Public ID is required for deletion");
      }

      const cloudinary = cloudinaryClient();
      const destroyOptions: { resource_type?: ResourceType; invalidate: boolean } = {
        invalidate: true,
      };

      if (resourceType !== "auto") {
        destroyOptions.resource_type = resourceType;
      }

      const result = await cloudinary.uploader.destroy(publicId, destroyOptions);

      if (result.result !== "ok" && result.result !== "not found") {
        throw new ExternalServiceError("Cloudinary", `Failed to delete file: ${result.result}`);
      }

      return { result: result.result };
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof ExternalServiceError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new ExternalServiceError("Cloudinary", `File deletion failed: ${message}`, { error });
    }
  }

  /** Delete multiple files from Cloudinary */
  public async deleteFiles(publicIds: string[], resourceType: ResourceType = "auto"): Promise<{ deleted: string[]; not_found: string[] }> {
    try {
      if (!Array.isArray(publicIds) || publicIds.length === 0) {
        return { deleted: [], not_found: [] };
      }

      const cloudinary = cloudinaryClient();
      const summary = {
        deleted: [] as string[],
        not_found: [] as string[],
      };

      const accumulateResults = (response: DeleteResourcesResponse) => {
        if (response.deleted && typeof response.deleted === "object") {
          Object.entries(response.deleted).forEach(([id, status]) => {
            if (status === "deleted") {
              summary.deleted.push(id);
            } else if (status === "not found") {
              summary.not_found.push(id);
            }
          });
        }

        if (Array.isArray(response.not_found)) {
          summary.not_found.push(...response.not_found);
        }
      };

      const deleteByType = async (ids: string[], type: Exclude<ResourceType, "auto">) => {
        if (ids.length === 0) return;

        try {
          const response = await cloudinary.api.delete_resources(ids, {
            resource_type: type,
            invalidate: true,
          });
          accumulateResults(response as DeleteResourcesResponse);
        } catch (error) {
          console.error(`[Cloudinary] Failed to delete files:`, error);
          throw new ExternalServiceError("Cloudinary", `Failed to delete files: ${error}`, { error });
        }
      };

      if (resourceType === "auto") {
        await deleteByType(publicIds, "video");

        const remainingIds = publicIds.filter((id) => !summary.deleted.includes(id) && !summary.not_found.includes(id));

        if (remainingIds.length > 0) {
          await deleteByType(remainingIds, "image");
        }
      } else {
        await deleteByType(publicIds, resourceType);
      }

      return summary;
    } catch (error: unknown) {
      if (error instanceof ExternalServiceError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new ExternalServiceError("Cloudinary", `Bulk file deletion failed: ${message}`, { error });
    }
  }
}

// Singleton exports
export const cloudinaryService = CloudinaryService.getInstance();

// Backward compatibility - export methods directly
export const uploadVideo = (file: string | Buffer, options?: VideoUploadOptions) => cloudinaryService.uploadVideo(file, options);
export const uploadImage = (file: string | Buffer, options?: ImageUploadOptions) => cloudinaryService.uploadImage(file, options);
export const deleteFile = (publicId: string, resourceType?: ResourceType) => cloudinaryService.deleteFile(publicId, resourceType);
export const deleteFiles = (publicIds: string[], resourceType?: ResourceType) => cloudinaryService.deleteFiles(publicIds, resourceType);
