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
