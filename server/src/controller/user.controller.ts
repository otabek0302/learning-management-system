import { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../config/config";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { IJwtPayload } from "../@types/auth.types";
import { ISocialAuthRequest, IUser } from "../@types/user.types";

import { checkUserExist, createActivationToken, getUserById, verifyActivationToken, createForgotPasswordToken, verifyForgotPasswordToken } from "../services/user.service";
import { ILogin, IRegister, IUpdatePassword, IUpdateUserInfo, IUpdateUserAvatar, IForgotPassword, IForgotPasswordRequest, IResetPassword, IUpdateUserRole, IDeleteUser, IGetUserById } from "../interfaces/user.interface";
import { createNotification } from "../services/notification.service";

import jwt from "jsonwebtoken";
import CatchAsyncErrors from "../middleware/catchAsyncErrors"
import ErrorHandler from "../utils/ErrorHandler";
import User from "../models/user.model";
import sendMail from "../utils/sendMail";
import redis from "../utils/redis";
import cloudinary from "cloudinary";

// Register User
export const registerUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password }: IUser = req.body;

        // Validate user is exist or not
        const userExists = await checkUserExist(email, res, next);
        if (!userExists) {
            return;
        }

        // Create user
        const user = { name, email, password } as IRegister;

        // Create activation token
        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode }

        try {
            await sendMail({
                email: user.email,
                subject: "Activation Code",
                template: "activation-mail.ejs",
                data
            });

            res.status(201).json({
                success: true,
                message: `Please check your email address: ${user.email} to activate your account.`,
                activationToken: activationToken.token
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Activate User Account
export const activateUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Verify activation token
        const user = await verifyActivationToken(req.body.activation_token, req.body.activation_code, res, next);

        if (!user) {
            return next(new ErrorHandler("Invalid activation token or code", 400));
        }

        // Create Notification
        await createNotification({
            user: user?._id || "",
            title: "New User",
            message: `New user ${user?.name} has been created`
        });

        res.status(201).json({
            success: true,
            message: `User created successfully with email ${user?.email}`,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

export const loginUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body as ILogin;

        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400));
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        // Generate token
        sendToken(user, 200, res);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Logout User
export const logoutUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });

        redis.del(req.user._id.toString());

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Update access token 
export const updateAccessToken = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token as string | undefined;

        if (!refresh_token) {
            return next(new ErrorHandler("Please login to access this resource", 401));
        }

        let decoded: IJwtPayload;

        try {
            decoded = jwt.verify(refresh_token, REFRESH_TOKEN as string) as IJwtPayload;
        } catch (error) {
            return next(new ErrorHandler("Refresh token is not valid or has expired", 401));
        }

        if (!decoded || !decoded.id) {
            return next(new ErrorHandler("Refresh token payload is invalid", 400));
        }

        const session: string | null = await redis.get(decoded.id as string);

        if (!session) {
            return next(new ErrorHandler("Refresh token is not valid or has expired", 401));
        }

        const user = session as unknown as IUser;

        if (!user || !user._id) {
            return next(new ErrorHandler("User session is invalid", 400));
        }

        const accessToken = jwt.sign({ id: user?._id }, ACCESS_TOKEN as string, {
            expiresIn: "5m",
        });

        const refreshToken = jwt.sign({ id: user?._id }, REFRESH_TOKEN as string, {
            expiresIn: "1d",
        });

        req.user = user;

        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);

        // Update user in Redis with 30 days expiration
        await redis.set(user._id.toString(), JSON.stringify(user), { ex: 30 * 24 * 60 * 60 });

        // Upload session to Redis
        res.status(200).json({
            success: true,
            accessToken
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// User services
export const getUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;

        getUserById(userId, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Social auth
export const socialAuth = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, avatar } = req.body as ISocialAuthRequest;
        const user = await User.findOne({ email })

        if (!user) {
            const newUser = await User.create({ email, name, avatar })
            sendToken(newUser, 200, res);
        } else {
            sendToken(user, 200, res);
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


// Update user info
export const updateUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, avatar } = req.body as IUpdateUserInfo;

        if ((!email || !email.trim()) && (!name || !name.trim())) {
            return next(new ErrorHandler("No changes provided", 400));
        }

        const userId = req.user?._id;
        const user = await User.findById(userId);

        if (email && user) {
            user.email = email;
        }

        if (name && user) {
            user.name = name;
        }

        if (user?.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }
        
        if (user && typeof avatar === "string") {
            const uploadResponse = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars", width: 150, height: 150, crop: "fill" });
            user.avatar = {
                public_id: uploadResponse.public_id,
                url: uploadResponse.secure_url
            };
        }

        await user?.save();

        await redis.set(userId, JSON.stringify(user));

        res.status(200).json({
            success: true,
            message: "User info updated successfully",
            user
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Update user password
export const updatePassword = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body as IUpdatePassword;
        console.log("Updating password", oldPassword, newPassword);
        

        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Please enter old and new password", 400));
        }

        const user = await User.findById(req.user?._id).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        const isPasswordMatch = await user.comparePassword(oldPassword);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Old password is incorrect", 400));
        }

        if (newPassword.length < 8) {
            return next(new ErrorHandler("Password must be at least 8 characters long", 400));
        }

        user.password = newPassword;
        await user.save();

        await redis.set(user._id.toString(), JSON.stringify(user));

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Update user Avatar
export const updateProfilePicture = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { avatar } = req.body as IUpdateUserAvatar;

        if (!avatar) {
            return next(new ErrorHandler("Please enter avatar", 400));
        }

        const userId = req.user?._id;
        const user = await User.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        // Always destroy previous avatar
        if (user.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }

        // Always upload new one
        const uploadResponse = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            height: 150,
            crop: "fill",
            resource_type: "auto"
        });

        user.avatar = {
            public_id: uploadResponse.public_id,
            url: uploadResponse.secure_url
        };

        await user.save();
        await redis.set(userId, JSON.stringify(user));

        res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            user
        });
    } catch (error: any) {
        console.error("Avatar upload error:", error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Forgot password
export const forgotPassword = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as IForgotPassword;

        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }


        const forgotPasswordToken = createForgotPasswordToken(user);
        const forgotPasswordCode = forgotPasswordToken.forgotPasswordCode;
        const data = { user: { name: user.name }, forgotPasswordCode }

        try {
            await sendMail({
                email: user.email,
                subject: "Forgot Password",
                template: "forgot-password-mail.ejs",
                data
            });

            res.status(200).json({
                success: true,
                message: `Please check your email address: ${user.email} to reset your password.`,
                forgotPasswordToken: forgotPasswordToken.token
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Verify forgot password token
export const verifyForgotPasswordCode = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { forgot_password_token, forgot_password_code } = req.body as IForgotPasswordRequest;

        const user = await verifyForgotPasswordToken(forgot_password_token, forgot_password_code, res, next);

        if (!user) {
            return next(new ErrorHandler("Invalid or expired password reset token", 400));
        }

        // Store user in Redis with a temporary key for password reset
        const resetKey = `password-reset-${user._id}`;
        await redis.set(resetKey, JSON.stringify(user), { ex: 300 }); // expires in 5 minutes

        res.status(200).json({
            success: true,
            message: "Forgot password code verified successfully",
            resetKey // Send this key to be used in reset password
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Reset password
export const resetPassword = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, resetKey } = req.body as IResetPassword;

        if (!password || !resetKey) {
            return next(new ErrorHandler("Please provide password and reset key", 400));
        }

        // Get user from Redis using resetKey
        const userJson = await redis.get(resetKey);
        if (!userJson) {
            return next(new ErrorHandler("Password reset session expired or invalid", 400));
        }

        const userInfo = userJson as unknown as IUser;
        const user = await User.findById(userInfo._id).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        user.password = password;
        await user.save();

        // Clear the reset key from Redis
        await redis.del(resetKey);

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


// ---- Admin Routes ---- //

// Get All Users
export const getAllUsers = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get page and limit from query params
        const page = parseInt(req.query.page as string) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        // Create base query excluding the requesting user and password
        const baseQuery = User.find({ _id: { $ne: req.user?._id } }).select("-password").lean().sort({ createdAt: -1 });

        // Get total count for pagination
        const totalUsers = await User.countDocuments({ _id: { $ne: req.user?._id } });

        // Execute paginated query
        const users = await baseQuery.skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers,
                hasMore: totalUsers > skip + users.length
            }
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Search Users
export const searchUsers = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get search query from query params
        const { search } = req.query as { search: string };
        console.log(search);


        // Search users by name or email
        const users = await User.find({
            $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
        }).select("-password").lean();

        res.status(200).json({
            success: true,
            users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Get User By Id
export const fetchUserById = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get user id from body
        const { id } = req.body as IGetUserById;

        // Get user by id
        const user = await User.findById(id).select("-password").lean();

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Delete User
export const deleteUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get user id from body
        const { id } = req.body as IDeleteUser;

        // Get user by id
        const user = await User.findById(id);

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Update User Role
export const updateUserRole = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get user id and role from body
        const { id, role } = req.body as IUpdateUserRole;

        // Get user by id
        const user = await User.findById(id);

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        // Update user role
        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})