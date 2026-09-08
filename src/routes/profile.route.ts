import express from "express";

const profileRouter = express.Router();

profileRouter.route("/").get().patch().delete();

export { profileRouter };
