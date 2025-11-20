import { Request, Response, NextFunction } from "express";
import { ORIGINS } from "./config/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/error";

// Routes
import UserRouter from "./routes/user.route";
import CourseRouter from "./routes/course.route";
import OrderRouter from "./routes/order.route";
import NotificationRouter from "./routes/notification.route";
import AnalyticRouter from "./routes/analytic.route";
import LayoutRouter from "./routes/layout.route";
import EnrollmentRouter from "./routes/enrollment.route";
import ProgressRouter from "./routes/progress.route";
import QuizRouter from "./routes/quiz.route";
import CertificateRouter from "./routes/certificate.route";
import CouponRouter from "./routes/coupon.route";
import VideoRouter from "./routes/video.route";

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
app.use("/api/v1/users", UserRouter)
app.use("/api/v1/courses", CourseRouter)
app.use("/api/v1/orders", OrderRouter)
app.use("/api/v1/notifications", NotificationRouter)
app.use("/api/v1/analytics", AnalyticRouter)
app.use("/api/v1/layout", LayoutRouter)
app.use("/api/v1/enrollments", EnrollmentRouter)
app.use("/api/v1/progress", ProgressRouter)
app.use("/api/v1/quiz", QuizRouter)
app.use("/api/v1/certificates", CertificateRouter)
app.use("/api/v1/coupons", CouponRouter)
app.use("/api/v1/videos", VideoRouter)
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