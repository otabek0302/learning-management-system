import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "@middlewares/error.handler";
import { z } from "zod";

const isValidAvatarUrl = (val: string) => {
  if (!val) return true;
  if (typeof val === "object") return true;
  if (val.startsWith("data:image/")) return true;
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
};

// ─── Auth ──────────────────────────────────────────────────────────────────
const signUpByEmailSchema = z.object({
  body: z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters").max(50).optional(),
    last_name: z.string().max(50).optional(),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters").max(100),
  }),
});

const signUpByPhoneSchema = z.object({
  body: z.object({
    first_name: z.string().min(2).max(50).optional(),
    last_name: z.string().max(50).optional(),
    phone: z.string().min(10).max(15),
    password: z.string().min(6).max(100),
  }),
});

const signInByEmailSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").min(1),
    password: z.string().min(1, "Password is required"),
  }),
});

const signInByPhoneSchema = z.object({
  body: z.object({
    phone: z.string().min(10).max(15),
    password: z.string().min(1, "Password is required"),
  }),
});

const verifyOtpSchema = z.object({
  body: z
    .object({
      email: z.union([z.string().email(), z.literal("")]).optional(),
      phone: z.union([z.string().min(10).max(15), z.literal("")]).optional(),
      code: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must be numeric"),
    })
    .refine((data) => (data.email?.trim()?.length ?? 0) > 0 || (data.phone?.trim()?.length ?? 0) > 0, {
      message: "Either email or phone is required",
      path: ["email"],
    }),
});

const resendOtpSchema = z.object({
  body: z
    .object({
      email: z.union([z.string().email(), z.literal("")]).optional(),
      phone: z.union([z.string().min(10).max(15), z.literal("")]).optional(),
    })
    .refine((data) => (data.email?.trim()?.length ?? 0) > 0 || (data.phone?.trim()?.length ?? 0) > 0, {
      message: "Either email or phone is required",
      path: ["email"],
    }),
});

const refreshTokenSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().optional(),
    })
    .optional(),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(6, "Password must be at least 6 characters").max(100),
  }),
});

// ─── Profile ───────────────────────────────────────────────────────────────
const updateProfileSchema = z.object({
  body: z.object({
    first_name: z.string().min(2).max(50).optional(),
    last_name: z.string().max(50).optional(),
    avatar: z.union([z.string().refine(isValidAvatarUrl, { message: "Avatar must be a valid URL or base64 data URL" }), z.record(z.unknown())]).optional(),
    age: z.number().int().min(0).max(150).optional(),
    gender: z.string().max(20).optional(),
  }),
});

const updatePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").max(100),
  }),
});

const updatePreferencesSchema = z.object({
  body: z.object({
    two_factor_authentication_enabled: z.boolean().optional(),
    email_notifications_enabled: z.boolean().optional(),
    push_notifications_enabled: z.boolean().optional(),
    theme: z.enum(["light", "dark"]).optional(),
    timezone: z.string().optional(),
    language: z.string().optional(),
  }),
});

// ─── Student ───────────────────────────────────────────────────────────────
const courseIdParamSchema = z.object({
  params: z.object({
    courseId: z
      .string()
      .length(24, "Invalid ID")
      .regex(/^[a-f0-9]+$/i, "Invalid ID format"),
  }),
});

// ─── Admin ─────────────────────────────────────────────────────────────────
const userIdParamSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24, "Invalid ID")
      .regex(/^[a-f0-9]+$/i, "Invalid ID format"),
  }),
});

const createUserSchema = z.object({
  body: z.object({
    first_name: z.string().min(2).max(50),
    last_name: z.string().max(50).optional(),
    email: z.string().email().min(1),
    phone: z.string().min(10).max(15),
    password: z.string().min(6).max(100),
    role: z.enum(["student", "instructor", "admin"]).optional().default("student"),
    send_email_verification: z.boolean().optional().default(true),
    send_phone_verification: z.boolean().optional().default(true),
  }),
});

const adminUpdateUserSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24)
      .regex(/^[a-f0-9]+$/i),
  }),
  body: z.object({
    first_name: z.string().min(2).max(50).optional(),
    last_name: z.string().max(50).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
    role: z.enum(["student", "instructor", "admin"]).optional(),
    status: z.enum(["active", "inactive", "blocked", "deleted"]).optional(),
  }),
});

const restrictAccountSchema = z.object({
  params: z.object({
    id: z
      .string()
      .length(24)
      .regex(/^[a-f0-9]+$/i),
  }),
  body: z.object({
    reason: z.string().min(1, "Reason is required"),
  }),
});

const listUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    role: z.enum(["student", "instructor", "admin"]).optional(),
    status: z.enum(["active", "inactive", "blocked", "deleted"]).optional(),
    search: z.string().optional(),
  }),
});

// ─── Validate (single wrapper, server-style) ───────────────────────────────
type RequestSchema = z.ZodObject<Record<string, z.ZodTypeAny>>;

const validate = (schema: RequestSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({ body: req.body, query: req.query, params: req.params });
      if (parsed.body) Object.assign(req.body, parsed.body);
      if (parsed.query) Object.assign(req.query, parsed.query);
      if (parsed.params) Object.assign(req.params, parsed.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => ({ path: err.path.join("."), message: err.message }));
        next(new ValidationError("Validation failed", { errors }));
      } else {
        next(new ValidationError("Invalid request data"));
      }
    }
  };
};

// ─── Exported validators ───────────────────────────────────────────────────
export const validateSignUpByEmail = validate(signUpByEmailSchema);
export const validateSignUpByPhone = validate(signUpByPhoneSchema);
export const validateSignInByEmail = validate(signInByEmailSchema);
export const validateSignInByPhone = validate(signInByPhoneSchema);
export const validateVerifyOtp = validate(verifyOtpSchema);
export const validateResendOtp = validate(resendOtpSchema);
export const validateRefreshToken = validate(refreshTokenSchema);
export const validateForgotPassword = validate(forgotPasswordSchema);
export const validateResetPassword = validate(resetPasswordSchema);
export const validateUpdateProfile = validate(updateProfileSchema);
export const validateUpdatePassword = validate(updatePasswordSchema);
export const validateUpdatePreferences = validate(updatePreferencesSchema);
export const validateCourseIdParam = validate(courseIdParamSchema);
export const validateUserIdParam = validate(userIdParamSchema);
export const validateCreateUser = validate(createUserSchema);
export const validateAdminUpdateUser = validate(adminUpdateUserSchema);
export const validateRestrictAccount = validate(restrictAccountSchema);
export const validateListUsersQuery = validate(listUsersQuerySchema);
