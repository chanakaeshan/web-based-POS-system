import asyncHandler from "express-async-handler";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// 📊 Get total sales and revenue
export const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const sales = await Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  res.json(sales[0] || { totalSales: 0, totalRevenue: 0 });
});

// 🏆 Get top-selling products
export const getTopSellingProducts = asyncHandler(async (req, res) => {
  const topProducts = await Sale.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalQuantitySold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalQuantitySold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $project: {
        name: "$productDetails.name",
        totalQuantitySold: 1,
      },
    },
  ]);

  res.json(topProducts);
});

// 📉 Get low stock products
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select(
    "name stock"
  );
  res.json(lowStockProducts);
});
