import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String }, // Optional: Store image URLs
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
