import express from "express";
import { checkLowStock } from "../controllers/inventoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/check-low-stock", protect, checkLowStock);
router.put("/update-stock", updateStock);

export default router;
