import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";

const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Default status code and message if not set
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // MongoDB CastError (invalid ObjectId)
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400); // Bad Request
    }

    // MongoDB ValidationError (validation failure on schema)
    if (err.name === "ValidationError") {
        const message = `Validation Error: ${Object.values(err.errors).map((e: any) => e.message).join(', ')}`;
        err = new ErrorHandler(message, 400); // Bad Request
    }

    // MongoDB Duplicate Key Error (unique field constraint violation)
    if (err.code === 11000) {
        const message = `Duplicate field value entered. Please enter a unique value for ${Object.keys(err.keyValue).join(", ")}`;
        err = new ErrorHandler(message, 400); // Bad Request
    }

    // MongoDB MongoError (general MongoDB error)
    if (err.name === "MongoError") {
        const message = err.message || "MongoDB error occurred.";
        err = new ErrorHandler(message, 500); // Internal Server Error
    }

    // JWT Token Errors
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token. Please login again.";
        err = new ErrorHandler(message, 401); // Unauthorized
    }
    
    if (err.name === "TokenExpiredError") {
        const message = "Token has expired. Please login again.";
        err = new ErrorHandler(message, 401); // Unauthorized
    }

    // Handling 404 (Not Found)
    if (err.message === "Not Found") {
        err = new ErrorHandler("Resource not found", 404); // Not Found
    }

    // Handle all other errors
    if (!err.statusCode) {
        err = new ErrorHandler(err.message || "Something went wrong", err.statusCode || 500);
    }

    // Send the error response to the client
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack // Hide stack trace in production
    });
};

export default ErrorMiddleware;