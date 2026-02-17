import mongoose from "mongoose";

export const userPreferencesSchema = new mongoose.Schema(
  {
    two_factor_authentication_enabled: { type: Boolean, default: false },
    email_notifications_enabled: { type: Boolean, default: true },
    push_notifications_enabled: { type: Boolean, default: true },
    
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    timezone: { type: String, default: "UTC" },
    language: { type: String, default: "en" },
  },
  { _id: false }
);
