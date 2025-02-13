import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// Add a new product (Admin & Stock Manager only)
export const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, quantity, category } = req.body;

  const product = await Product.create({ name, description, price, quantity, category });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

// Get all products (Available for all users)
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Update a product (Admin & Stock Manager only)
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, quantity, category } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// Delete a product (Admin & Stock Manager only)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
