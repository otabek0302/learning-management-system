import express from "express";
import { uploadLessonVideo } from "../controller/video.controller";
import { uploadVideo } from "../middleware/multer";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post(
  "/upload",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadVideo.single("video"),
  uploadLessonVideo
);

export default router;
