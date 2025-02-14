import express from "express";
import { recordSale, getSales } from "../controllers/saleController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/record", protect, authorizeRoles("cashier"), recordSale);

router.get("/", protect, authorizeRoles("admin", "stock_manager"), getSales);

export default router;
