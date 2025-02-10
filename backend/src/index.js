import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();  // Connect to MongoDB

const app = express();
app.use(express.json());
app.use(cors());

// Default route
app.get("/", (req, res) => {
  res.send("POS System API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
