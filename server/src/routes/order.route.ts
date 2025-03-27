import { Router } from "express";

import { isAuthenticated } from "../middleware/auth";
import { createOrder } from "../controller/order.controller";

const router = Router();


// Create Order
router.post("/create-order", isAuthenticated, createOrder);


export default router;