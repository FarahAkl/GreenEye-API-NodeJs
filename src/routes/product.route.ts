import express from "express";

const productRouter = express.Router();

productRouter.route("/").get();

productRouter.route("/:productId").get();

export { productRouter };
