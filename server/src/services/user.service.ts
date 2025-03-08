import { Response } from "express";

import redis from "../utils/redis";


// Get user by id
export const getUserById = async (id: string, res: Response) => {
    const userJson = await redis.get(id);

    if (userJson) {
        const user = JSON.parse(userJson as string);
        res.status(200).json({
            success: true,
            user
        });
    } else {
        res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
}   