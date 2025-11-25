export type ResourceType = "video" | "image" | "raw" | "auto";

export interface CloudinaryDestroyResponse {
  result: "ok" | "not found" | string;
}

export interface VideoUploadOptions {
  folder?: string;
  public_id?: string;
  overwrite?: boolean;
  invalidate?: boolean;
}

export interface ImageUploadOptions {
  folder?: string;
  width?: number;
  height?: number;
  crop?: string;
  public_id?: string;
  overwrite?: boolean;
  invalidate?: boolean;
}

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

/** Response from Cloudinary delete_resources API */
export interface DeleteResourcesResponse {
  deleted?: Record<string, string>;
  not_found?: string[];
}
