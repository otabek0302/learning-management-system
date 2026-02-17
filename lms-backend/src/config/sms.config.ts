import { env } from "@config/env.config";

// DevSMS variables
if (!env.DEVSMS_URL || !env.DEVSMS_TOKEN) {
  throw new Error("DEVSMS_URL and DEVSMS_TOKEN are required");
}

const smsConfig = {
  url: env.DEVSMS_URL,
  token: env.DEVSMS_TOKEN,
  from: env.DEVSMS_FROM ?? "4546",
};

export { smsConfig };
