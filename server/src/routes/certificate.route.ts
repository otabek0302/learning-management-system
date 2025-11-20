import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { issueCertificate, getMyCertificate, getMyCertificates } from "../controller/certificate.controller";

const router = express.Router();

router.post("/issue", isAuthenticated, issueCertificate);
router.get("/", isAuthenticated, getMyCertificates);
router.get("/:courseId", isAuthenticated, getMyCertificate);

export default router;
