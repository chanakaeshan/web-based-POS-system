import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { sendLowStockAlert } from "../utils/emailService.js";

// 📌 Check & Notify Low-Stock Products
export const checkLowStock = asyncHandler(async (req, res) => {
  const lowStockProducts = await Product.find({ stock: { $lt: 5 } }); // Threshold = 5

  if (lowStockProducts.length > 0) {
    await sendLowStockAlert("admin@example.com", lowStockProducts);
  }

  res.json({ message: "Low-stock check completed!" });
});
