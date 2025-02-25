import cron from "node-cron";
import { emailPDFReport } from "../controllers/reportsController.js";
import { checkLowStock } from "../controllers/inventoryController.js";

// 🕒 Schedule a Daily Report at 8 AM
cron.schedule("0 8 * * *", async () => {
  console.log("📧 Sending daily sales report...");
  await emailPDFReport({
    body: { startDate: "2024-01-01", endDate: new Date().toISOString(), email: "admin@example.com" },
  });
});

// 🕒 Schedule a Weekly Report (Monday 8 AM)
cron.schedule("0 8 * * 1", async () => {
  console.log("📧 Sending weekly sales report...");
  await emailPDFReport({
    body: { startDate: "2024-01-01", endDate: new Date().toISOString(), email: "admin@example.com" },
  });
});

// 🕒 Check Low Stock Daily at 7 AM
cron.schedule("0 7 * * *", async () => {
  console.log("📧 Checking for low-stock products...");
  await checkLowStock();
});