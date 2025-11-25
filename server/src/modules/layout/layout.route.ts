import express from "express";
import {
  getLayoutByType,
  getLayoutById,
  getAllLayouts,
  createLayout,
  updateLayout,
  deleteLayout,
} from "./layout.controller";
import { authenticated, authorized } from "../../middleware/auth.middleware";
import {
  validateCreateLayout,
  validateUpdateLayout,
  validateGetLayoutByType,
  validateGetLayoutById,
  validateDeleteLayout,
} from "./layout.validation";

const router = express.Router();

router.get("/get-layout/:type", validateGetLayoutByType, getLayoutByType);
router.get("/get-layout-by-id/:id", validateGetLayoutById, getLayoutById);
router.get("/get-all-layouts", authenticated, authorized("admin"), getAllLayouts);
router.post("/create-layout", authenticated, authorized("admin"), validateCreateLayout, createLayout);
router.put("/edit-layout/:id", authenticated, authorized("admin"), validateUpdateLayout, updateLayout);
router.delete("/delete-layout/:id", authenticated, authorized("admin"), validateDeleteLayout, deleteLayout);

export default router;

