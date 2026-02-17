import mongoose from "mongoose";

import { databaseConfig } from "@config/database.config";
import { logger } from "@shared/services/logger.service";

const connectDatabase = async (): Promise<typeof mongoose> => {
  const conn = await mongoose.connect(databaseConfig.url, {
    user: databaseConfig.user,
    pass: databaseConfig.pass,
  });
  logger.info("Database connected.");
  return conn;
};

const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info("Database disconnected.");
};

export { connectDatabase, disconnectDatabase };
