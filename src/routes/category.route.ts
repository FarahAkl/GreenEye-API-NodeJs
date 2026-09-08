import express from "express";

const categoryRouter = express.Router();

categoryRouter.route("/").get().post();

categoryRouter.route("/:categoryId").get().put().delete();

export { categoryRouter };
