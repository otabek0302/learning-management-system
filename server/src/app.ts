import { Request, Response, NextFunction } from "express";
import { ORIGINS } from "./config/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/error";

import UserRouter from "./routes/user.route";

// Initialize express
const app = express();

// Security and logging middleware
app.use(helmet());
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Body parsing and let only 50mb
app.use(express.json({ limit: "50mb" }));

// Cookie parser for cookies
app.use(cookieParser());

// Cors for other urls
app.use(cors({
    origin: ORIGINS,
    credentials: true
}));

// API Routers
app.use("/api/v1", UserRouter)

// Unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err: any = new Error(`Cannot find ${req.originalUrl} on this server!`);
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