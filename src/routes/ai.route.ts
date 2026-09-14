import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { classification } from "../controllers/ai.controller.js";

const aiRouter = express.Router();

aiRouter.route("/classification").post(asyncHandler(classification));

// aiRouter.route("/crop-disease").post();
// aiRouter.route("/crop-disease/history").get();
// aiRouter.route("/crop-disease/history/:id").delete().get();

// aiRouter.route("/crop-growth-simulation").post();

// aiRouter.route("/crop-recommendation").post();
// aiRouter.route("/crop-recommendation/history").get();

// aiRouter.route("/forecast").post();
// aiRouter.route("/forecast/history").get();

export { aiRouter };
