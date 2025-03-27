import { Router } from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getAllNotifications, updateNotificationStatus } from "../controller/notification.controller";

const router = Router();

// Get All Notifications -- Only for Admin
router.get("/get-all-notifications", isAuthenticated, authorizeRoles("admin"), getAllNotifications);

// Update Notification Status -- Only for Admin
router.put("/update-notification-status/:id", isAuthenticated, authorizeRoles("admin"), updateNotificationStatus);

export default router;