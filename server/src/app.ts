import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/error";

// Initialize express
const app = express();

// Load environment variables
dotenv.config();

// Middleware setup
// Body parsing and let only 50mb
app.use(express.json({ limit: "50mb" }));

// Cookie parser for cookies
app.use(cookieParser());

// Cors for other urls
const origins = process.env.ORIGIN?.split(",") || ["http://localhost:3000"];
app.use(cors({
    origin: origins
}));

// Unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Unknown route ${req.originalUrl}`) as any;
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
    });
});

// Error middleware
app.use(ErrorMiddleware);

export default app;