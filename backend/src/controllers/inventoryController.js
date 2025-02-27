import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { sendLowStockAlert } from "../utils/emailService.js";
import { emitStockUpdate } from "../server.js";


// 📌 Check & Notify Low-Stock Products
export const checkLowStock = asyncHandler(async (req, res) => {
  const lowStockProducts = await Product.find({ stock: { $lt: 5 } }); // Threshold = 5

  if (lowStockProducts.length > 0) {
    await sendLowStockAlert("admin@example.com", lowStockProducts);
  }

  res.json({ message: "Low-stock check completed!" });
});

// 📌 Update Product Stock & Emit Event
export const updateStock = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.stock -= quantity;
  await product.save();

  emitStockUpdate(product); // 🔄 Broadcast stock update
  res.json(product);
});