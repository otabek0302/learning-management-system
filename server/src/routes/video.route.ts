import express from "express";
import { uploadLessonVideo } from "../controller/video.controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post(
  "/upload",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadLessonVideo
);

export default router;
