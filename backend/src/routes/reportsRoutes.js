import express from "express";
import { getSalesReport, getTopSellingProducts, getLowStockProducts } from "../controllers/reportsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { emailPDFReport, emailExcelReport } from "../controllers/reportsController.js";

const router = express.Router();

router.get("/sales", protect, getSalesReport);
router.get("/top-products", protect, getTopSellingProducts);
router.get("/low-stock", protect, getLowStockProducts);
router.post("/email/pdf", protect, emailPDFReport);
router.post("/email/excel", protect, emailExcelReport);

export default router;
