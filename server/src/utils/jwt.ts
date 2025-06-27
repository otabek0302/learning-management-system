import { CookieOptions, Response } from 'express';
import { IUser } from '../models/user.model';
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE, NODE_ENV } from '../config/config';

import redis from "./redis";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite?: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
}

// Parse eviroment variables to integrates with fallback values
export const accessTokenExpire = parseInt(ACCESS_TOKEN_EXPIRE || '300', 10)
export const refreshTokenExpire = parseInt(REFRESH_TOKEN_EXPIRE || '3600', 10)

// Options for cookies
export const accessTokenOptions: CookieOptions = {
    // 300 seconds = 5 minutes
    expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
    // 300 seconds = 5 minutes
    maxAge: accessTokenExpire * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
}

export const refreshTokenOptions: CookieOptions = {
    // 3600 seconds = 3 hours
    expires: new Date(Date.now() + refreshTokenExpire * 60 * 60 * 1000),
    // 3600 seconds = 3 hours
    maxAge: refreshTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // Upload session to Redis
    // redis.set(user._id, JSON.stringify(user) as any);
    // redis.set(user._id.toString(), JSON.stringify(user.toObject() as any), { ex: 3600 });
    redis.set(user._id.toString(), JSON.stringify(user.toObject() as any), { ex: refreshTokenExpire * 60 }); // if minutes


    // Only set secure to true in production
    if (NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    })
}