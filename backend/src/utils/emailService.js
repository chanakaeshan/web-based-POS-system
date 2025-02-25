import nodemailer from "nodemailer";
import fs from "fs";

// 📧 Create Email Transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // App Password
  },
});

// 📌 Send Low Stock Alert
export const sendLowStockAlert = async (to, products) => {
  const productList = products
    .map((p) => `🔻 ${p.name} - Only ${p.stock} left`)
    .join("\n");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "⚠️ Low Stock Alert!",
    text: `The following products are low in stock:\n\n${productList}`,
  };
};

// 📌 Send Email with Attachment
export const sendReportEmail = async (to, subject, text, attachmentPath) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: attachmentPath.split("/").pop(),
        path: attachmentPath,
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};
