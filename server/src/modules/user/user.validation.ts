import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationError } from "../../shared/errors/validation.error";

const emailSchema = z.string().email("Invalid email address").min(1, "Email is required");
const nameSchema = z.string().min(2, "Name must be at least 2 characters").max(50, "Name must not exceed 50 characters");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long");
const strongPasswordSchema = z.string().min(8, "Password must be at least 8 characters").max(100, "Password is too long");
const avatarSchema = z.string().min(1, "Avatar is required").refine(
  (val) => {
    if (val.startsWith("data:image/")) return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Avatar must be a valid URL or base64 data URL" }
);

export const registerSchema = z.object({
  body: z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  }),
});

export const activationSchema = z.object({
  body: z.object({
    activation_token: z.string().min(1, "Activation token is required"),
    activation_code: z.string().length(4, "Activation code must be 4 digits"),
  }),
});

export const updateUserInfoSchema = z.object({
  body: z
    .object({
      name: nameSchema.optional(),
      email: emailSchema.optional(),
      avatar: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val) return true;
            if (val.startsWith("data:image/")) return true;
            try {
              new URL(val);
              return true;
            } catch {
              return false;
            }
          },
          { message: "Avatar must be a valid URL or base64 data URL" }
        ),
    })
    .refine((data) => data.name || data.email || data.avatar, {
      message: "At least one field must be provided",
    }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: strongPasswordSchema,
  }),
});

export const updateAvatarSchema = z.object({
  body: z.object({
    avatar: avatarSchema,
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

export const verifyForgotPasswordSchema = z.object({
  body: z.object({
    forgot_password_token: z.string().min(1, "Forgot password token is required"),
    forgot_password_code: z.string().length(4, "Forgot password code must be 4 digits"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: strongPasswordSchema,
    resetKey: z.string().min(1, "Reset key is required"),
  }),
});

export const socialAuthSchema = z.object({
  body: z.object({
    email: emailSchema,
    name: nameSchema,
    avatar: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          if (val.startsWith("data:image/")) return true;
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Avatar must be a valid URL or base64 data URL" }
      ),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(["user", "admin"]).default("user"),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    role: z.enum(["user", "admin"]).optional(),
    isVerified: z.boolean().optional(),
  }),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    id: z.string().min(1, "User ID is required"),
    role: z.enum(["user", "admin"]),
  }),
});

export const deleteUserSchema = z.object({
  body: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

type ValidationSchema = z.ZodSchema<any>;

const validate = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fields: Record<string, string[]> = {};
        error.issues.forEach((issue: z.ZodIssue) => {
          const path = issue.path.join(".");
          if (!fields[path]) {
            fields[path] = [];
          }
          fields[path].push(issue.message);
        });
        return next(new ValidationError("Validation failed", fields));
      }
      next(error);
    }
  };
};

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateActivation = validate(activationSchema);
export const validateUpdateUserInfo = validate(updateUserInfoSchema);
export const validateUpdatePassword = validate(updatePasswordSchema);
export const validateUpdateAvatar = validate(updateAvatarSchema);
export const validateForgotPassword = validate(forgotPasswordSchema);
export const validateVerifyForgotPassword = validate(verifyForgotPasswordSchema);
export const validateResetPassword = validate(resetPasswordSchema);
export const validateSocialAuth = validate(socialAuthSchema);
export const validateCreateUser = validate(createUserSchema);
export const validateUpdateUser = validate(updateUserSchema);
export const validateUpdateUserRole = validate(updateUserRoleSchema);
export const validateDeleteUser = validate(deleteUserSchema);
export const validateGetUserById = validate(getUserByIdSchema);
