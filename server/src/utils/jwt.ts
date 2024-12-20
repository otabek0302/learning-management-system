import { Response } from 'express';
import { IUser } from '../models/user.models';
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE, NODE_ENV } from '../config/config';
import redis from "./redis";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite?: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // Upload session to Redis
    redis.set(user._id, JSON.stringify(user) as any);

    // Parse eviroment variables to integrates with fallback values
    const accessTokenExpire = parseInt(ACCESS_TOKEN_EXPIRE || '300', 10)
    const refreshTokenExpire = parseInt(REFRESH_TOKEN_EXPIRE || '1200', 10)

    // Options for cookies
    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax',
    }

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpire * 1000),
        maxAge: refreshTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax',
    }

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