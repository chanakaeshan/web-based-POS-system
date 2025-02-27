import reportRoutes from "./routes/reportsRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import "./utils/scheduler.js";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/inventoryRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }, // Allow frontend access
});


// 📌 WebSocket Event for Stock Updates
io.on("connection", (socket) => {
    console.log("🟢 A user connected");
  
    socket.on("disconnect", () => {
      console.log("🔴 A user disconnected");
    });
  });

  // 📌 Emit Stock Update Event
export const emitStockUpdate = (product) => {
    io.emit("stockUpdated", product);
  };


app.use("/api/inventory", productRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/products", productRoutes);
import "./utils/scheduler.js";

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
