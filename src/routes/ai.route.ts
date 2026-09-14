import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { classification } from "../controllers/ai.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const aiRouter = express.Router();

aiRouter.route("/classification").post(verifyToken,asyncHandler(classification));

// aiRouter.route("/forecast").post();
// aiRouter.route("/forecast/history").get();

// aiRouter.route("/crop-disease").post();
// aiRouter.route("/crop-disease/history").get();
// aiRouter.route("/crop-disease/history/:id").delete().get();

// aiRouter.route("/crop-growth-simulation").post();

// aiRouter.route("/crop-recommendation").post();
// aiRouter.route("/crop-recommendation/history").get();

export { aiRouter };
