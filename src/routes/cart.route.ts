import express from "express";

const cartRouter = express.Router();

cartRouter.route("/").get().delete();

cartRouter.route("/add-items").post();

cartRouter.route("/items/:cartItemId").put().delete();

export { cartRouter };
