import ErrorHandler from "../utils/error-handler";
import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    errors?: Record<string, any>;
    keyValue?: Record<string, string>;
    path?: string;
}

const ErrorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    // Default status code and message
    let statusCode = err.statusCode ?? 500;
    let message = err.message || "Internal Server Error";

    switch (err.name) {
        case "CastError":
            message = `Resource not found. Invalid: ${err.path}`;
            statusCode = 400;
            break;
        case "ValidationError":
            // Mongoose Validation Error
            if (err.errors) {
                const validationMessages = Object.values(err.errors).map((e: any) => e.message);
                message = `Validation Error: ${validationMessages.join(", ")}`;
                statusCode = 400;
            }
            break;
        case "MongoError":
            // General MongoDB error
            message = message || "MongoDB error occurred.";
            statusCode = statusCode || 500;
            break;
        case "JsonWebTokenError":
            // Invalid JWT token
            message = "Invalid token. Please login again.";
            statusCode = 401; // Unauthorized
            break;
        case "TokenExpiredError":
            // Expired JWT token
            message = "Token has expired. Please login again.";
            statusCode = 401;
            break;
        default:
            break;
    }

    // Check for MongoDB duplicate key error (code 11000)
    if (err.code === 11000) {
        const duplicateKeys = Object.keys(err.keyValue ?? {}).join(", ");
        message = `Duplicate field value entered. Please enter a unique value for ${duplicateKeys}`;
        statusCode = 400; // Bad Request
    }

    // Handle generic 404 Not Found
    if (message === "Not Found") {
        message = "Resource not found";
        statusCode = 404; // Not Found
    }

    // Ensure we return an ErrorHandler instance consistently
    const finalError = err instanceof ErrorHandler
        ? err
        : new ErrorHandler(message, statusCode);

    // Send the error response to the client
    res.status(finalError.statusCode).json({
        success: false,
        message: finalError.message,
        stack: process.env.NODE_ENV === "production" ? null : finalError.stack
    });
};

export default ErrorMiddleware;