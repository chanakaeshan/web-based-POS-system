import reportRoutes from "./routes/reportsRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import "./utils/scheduler.js";


app.use("/api/reports", reportRoutes);
app.use("/api/products", productRoutes);
