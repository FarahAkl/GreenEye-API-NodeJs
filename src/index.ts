import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import expressRateLimit from "express-rate-limit";
import { authRouter } from "./routes/auth.route.js";
import { cartRouter } from "./routes/cart.route.js";
import { categoryRouter } from "./routes/category.route.js";
import { orderRouter } from "./routes/order.route.js";
import { productRouter } from "./routes/product.route.js";
import { statusText } from "./utils/constants.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || "";
const app = express();

mongoose.connect(DB_URL).then(() => console.log("Connected to MongoDB! ✅"));

app.use(cors());
app.use(express.json());
app.use(
  expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/marketplace/cart", cartRouter);
app.use("/api/marketplace/category", categoryRouter);
app.use("/api/marketplace/order", orderRouter);
app.use("/api/marketplace/product", productRouter);
app.use("/api/profile");

app.all("/*splat", (req, res, next) => {
  res
    .status(404)
    .json({
      status: statusText.ERROR,
      message: "This resource is not available",
    });
});

app.use(
  (
    error: Error & { statusCode?: number; statusText?: string },
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    res.status(error.statusCode || 500).json({
      status: error.statusText || statusText.ERROR,
      message: error.message || "Something is wrong!",
      code: error.statusCode || 500,
      data: null,
    });
  },
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}✅`);
});
