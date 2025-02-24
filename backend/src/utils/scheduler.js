import cron from "node-cron";
import { emailPDFReport } from "../controllers/reportsController.js";

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
