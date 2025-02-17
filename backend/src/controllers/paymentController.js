import Stripe from "stripe";
import asyncHandler from "express-async-handler";
import Sale from "../models/Sale.js";
import dotenv from "dotenv";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a Stripe Payment Intent
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, saleId } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: "usd",
    metadata: { saleId },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

// Confirm Payment
export const confirmPayment = asyncHandler(async (req, res) => {
  const { saleId } = req.body;

  const sale = await Sale.findById(saleId);
  if (!sale) {
    res.status(404);
    throw new Error("Sale not found");
  }

  sale.isPaid = true;
  await sale.save();

  res.json({ message: "Payment successful", sale });
});
