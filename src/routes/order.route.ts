import express from "express";

const orderRouter = express.Router();

orderRouter.route("/create").post();

orderRouter.route("/user/orders").get();

orderRouter.route("/:orderId").get();

orderRouter.route("/:orderId/cancel").post();

export { orderRouter };
