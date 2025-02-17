import express from "express";
import { getSalesReport, getTopSellingProducts, getLowStockProducts } from "../controllers/reportsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/sales", protect, getSalesReport);
router.get("/top-products", protect, getTopSellingProducts);
router.get("/low-stock", protect, getLowStockProducts);

export default router;
