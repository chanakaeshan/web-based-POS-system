import reportRoutes from "./routes/reportsRoutes.js";
import productRoutes from "./routes/productsRoutes.js";

app.use("/api/reports", reportRoutes);
app.use("/api/products", productRoutes);
