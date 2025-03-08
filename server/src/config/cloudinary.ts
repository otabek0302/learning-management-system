import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, CLOUD_API_KEY, CLOUD_SECRET_KEY } from "./config";

// Cloudinary configuration
const connectCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: CLOUD_NAME,
            api_key: CLOUD_API_KEY,
            api_secret: CLOUD_SECRET_KEY
        });
        console.log("✅ Cloudinary connected successfully");
    } catch (error: any) {
        console.log(error.message);
    }
}

export default connectCloudinary;