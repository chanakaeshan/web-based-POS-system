import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// Record a sale (Cashiers only)
export const recordSale = asyncHandler(async (req, res) => {
  const { products } = req.body;

  let totalAmount = 0;

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product || product.quantity < item.quantity) {
      res.status(400);
      throw new Error("Insufficient stock for " + product.name);
    }
    totalAmount += item.quantity * product.price;
    product.quantity -= item.quantity;
    await product.save();
  }

  const sale = await Sale.create({
    products,
    totalAmount,
    cashier: req.user._id,
  });

  res.status(201).json(sale);
});

// Get all sales (Admins & Stock Managers only)
export const getSales = asyncHandler(async (req, res) => {
  const sales = await Sale.find().populate("products.product", "name price").populate("cashier", "name");
  res.json(sales);
});
