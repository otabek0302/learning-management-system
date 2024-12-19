import mongoose from "mongoose";

import { DATABASE_URL } from "../config/config";

if (!DATABASE_URL) {
    throw new Error("Environment variable DB_URL is not defined. Please provide a valid MongoDB connection string.");
}

// Connection to the MongoDB database.
const connectToDatabase = async (): Promise<void> => {
    try {
        const connection = await mongoose.connect(DATABASE_URL, {
            dbName: "myDatabase",
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            autoIndex: true,
        });

        // Success message with database host information
        console.log(`✅ Connected to MongoDB at host: ${connection.connection.host}`);
    } catch (error) {
        // Gracefully handle connection errors
        console.error("❌ Error connecting to MongoDB:", error);

        // Optionally, you might want to exit the process if the database connection fails
        process.exit(1);
    }
};

// Handle shutdown of the application
const handleExit = (signal: NodeJS.Signals): void => {
  console.log(`⚠️ Received ${signal}. Closing MongoDB connection...`);

  mongoose.connection.close().then(() => {
    console.log("🔌 MongoDB connection closed. Exiting process.");
    process.exit(0);
  }).catch(err => {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  });
};


// Handle shutdown on process termination signals
process.on("SIGINT", () => handleExit("SIGINT"));
process.on("SIGTERM", () => handleExit("SIGTERM"));

export default connectToDatabase;