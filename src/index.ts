import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import expressRateLimit from "express-rate-limit";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
