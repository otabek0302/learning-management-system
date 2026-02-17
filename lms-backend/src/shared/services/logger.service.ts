import { env } from "@config/env.config";

import pino from "pino";
import pinoPretty from "pino-pretty";

const loggerOptions: pino.LoggerOptions = {
  level: env.LOG_LEVEL,
  formatters: {
    level: (label: string) => ({ level: label.toUpperCase() }),
  },
  base: { env: env.NODE_ENV },
};

// Use pino-pretty stream in development (avoids transport worker resolution issues)
const stream = env.NODE_ENV === "development" ? pinoPretty({ colorize: true, translateTime: "yyyy-mm-dd HH:MM:ss", ignore: "pid,hostname" }) : process.stdout;

export const logger = pino(loggerOptions, stream);
