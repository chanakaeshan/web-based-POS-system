import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin and stock manager can add products
router.post("/add", protect, authorizeRoles("admin", "stock_manager"), (req, res) => {
  res.json({ message: "Product added successfully!" });
});

// Only cashier can process sales
router.post("/sell", protect, authorizeRoles("cashier"), (req, res) => {
  res.json({ message: "Sale recorded successfully!" });
});

// All authenticated users can view products
router.get("/all", protect, (req, res) => {
  res.json({ message: "List of all products" });
});

export default router;
