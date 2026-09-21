// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import expressRateLimit from "express-rate-limit";
// import { errorResponse } from "./utils/helper.js";
// import { errorHandler } from "./middleware/errorHandler.js";
// import { seedAdmin } from "./seed/admin.seed.js";
// import { aiRouter } from "./routes/ai.route.js";
// import { authRouter } from "./routes/auth.route.js";
// import { profileRouter } from "./routes/profile.route.js";
// import { categoryRouter } from "./routes/category.route.js";
// import { supplierRouter } from "./routes/supplier.route.js";
// // import { cartRouter } from "./routes/cart.route.js";
// // import { orderRouter } from "./routes/order.route.js";
// // import { productRouter } from "./routes/product.route.js";
// import { adminRouter } from "./routes/admin.route.js";

// dotenv.config();

// const PORT = process.env.PORT || 5000;
// const DB_URL = process.env.DB_URL || "";
// const app = express();

// await mongoose
//   .connect(DB_URL)
//   .then(() => console.log("Connected to MongoDB! ✅"));
// await seedAdmin();

// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   expressRateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 300,
//     standardHeaders: true,
//     legacyHeaders: false,
//   }),
// );

// app.use("/api/ai", aiRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/admin", adminRouter);
// app.use("/api/profile", profileRouter);
// app.use("/api/supplier", supplierRouter);
// app.use("/api/marketplace/category", categoryRouter);
// // app.use("/api/marketplace/cart", cartRouter);
// // app.use("/api/marketplace/order", orderRouter);
// // app.use("/api/marketplace/product", productRouter);

// app.all("/{*splat}", (req, res) => {
//   res.status(404).json(errorResponse("This resource is not available", null));
// });

// app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}✅`);
// });

// export { app };

import mongoose from "mongoose";
import dotenv from "dotenv";

import { app } from "./app.js";
import { seedAdmin } from "./seed/admin.seed.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || "";

await mongoose.connect(DB_URL);
console.log("Connected to MongoDB! ✅");

await seedAdmin();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});