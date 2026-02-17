import mongoose from "mongoose";

export const userSecuritySchema = new mongoose.Schema(
  {
    account_restricted: { type: Boolean, default: false },
    restriction_reason: { type: String, trim: true },
    
    is_email_verified: { type: Boolean, default: false },
    is_phone_verified: { type: Boolean, default: false },
  },
  { _id: false }
);
