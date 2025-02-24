import asyncHandler from "express-async-handler";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import fs from "fs";
import Sale from "../models/Sale.js";
import path from "path"
import { sendReportEmail } from "../utils/emailService.js";


// 📊 Get total sales and revenue
export const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;


  let matchQuery = {
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  if (category) {
    const categoryProducts = await Product.find({ category }).select("_id");
    const productIds = categoryProducts.map((p) => p._id);
    matchQuery["items.product"] = { $in: productIds };
  }

  const sales = await Sale.aggregate([
    { $match: matchQuery },
    { $unwind: "$items" },

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
  res.json(sales[0] || { totalSales: 0, totalRevenue: 0 });
});

// 📄 Generate PDF Report & Send Email
export const emailPDFReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, email } = req.body;
  const sales = await Sale.find({
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });

  const filename = `sales-report-${Date.now()}.pdf`;
  const filePath = path.join("reports", filename);
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(16).text("Sales Report", { align: "center" });
  doc.moveDown();
  sales.forEach((sale, index) => {
    doc.text(`Sale #${index + 1}`, { underline: true });
    doc.text(`Date: ${sale.createdAt}`);
    doc.text(`Total Amount: $${sale.totalAmount}`);
    doc.moveDown();
  });
  doc.end();

  await sendReportEmail(email, "Sales Report (PDF)", "Please find the attached sales report.", filePath);
  res.json({ message: "Report emailed successfully!" });
});

// 📊 Generate Excel Report & Send Email
export const emailExcelReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, email } = req.body;
  const sales = await Sale.find({
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });

  const filename = `sales-report-${Date.now()}.xlsx`;
  const filePath = path.join("reports", filename);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Report");

  worksheet.columns = [
    { header: "Sale ID", key: "_id", width: 30 },
    { header: "Date", key: "createdAt", width: 20 },
    { header: "Total Amount ($)", key: "totalAmount", width: 15 },
  ];
  sales.forEach((sale) => worksheet.addRow(sale));

  await workbook.xlsx.writeFile(filePath);
  await sendReportEmail(email, "Sales Report (Excel)", "Please find the attached sales report.", filePath);
  res.json({ message: "Report emailed successfully!" });
});