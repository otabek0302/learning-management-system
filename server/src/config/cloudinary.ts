import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import { env } from "./env";
import { ExternalServiceError } from "../shared/errors/external-service.error";

export class Cloudinary {
  private static instance: Cloudinary;
  private isConfigured: boolean = false;

  private constructor() {}

  public static getInstance(): Cloudinary {
    if (!Cloudinary.instance) {
      Cloudinary.instance = new Cloudinary();
    }
    return Cloudinary.instance;
  }

  /** Connect to Cloudinary */
  public async connect(): Promise<void> {
    try {
      const config: ConfigOptions = {
        cloud_name: env.CLOUD_NAME,
        api_key: env.CLOUD_API_KEY,
        api_secret: env.CLOUD_SECRET_KEY,
        secure: true,
      };

      cloudinary.config(config);
      this.isConfigured = true;

      console.log(`[Cloudinary] Connected → Cloud: ${env.CLOUD_NAME}`);
    } catch (error: any) {
      console.error("[Cloudinary] Connection error:", error);
      throw new ExternalServiceError("Cloudinary", "Failed to connect", { error });
    }
  }

  /** Disconnect from Cloudinary */
  public async disconnect(): Promise<void> {
    // Cloudinary doesn't maintain persistent connections
    this.isConfigured = false;
    console.log("[Cloudinary] Disconnected");
  }

  /** Get Cloudinary v2 instance */
  public getClient(): typeof cloudinary {
    if (!this.isConfigured) {
      throw new ExternalServiceError("Cloudinary", "Cloudinary is not configured. Call connect() first.");
    }
    return cloudinary;
  }

  /** Check if Cloudinary is configured */
  public isConnected(): boolean {
    return this.isConfigured;
  }
}

// Singleton exports
export const cloudinaryService = Cloudinary.getInstance();
export const cloudinaryClient = () => cloudinaryService.getClient();
