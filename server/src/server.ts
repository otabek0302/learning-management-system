import { PORT } from "./config/config";

import app from "./app";
import dotenv from "dotenv";
import connectToDatabase from "./config/database";
import connectCloudinary from "./config/cloudinary";

// Load environment variables
dotenv.config();

// Connect to the database
connectToDatabase();

// Cloudinary configuration
connectCloudinary();


// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
});