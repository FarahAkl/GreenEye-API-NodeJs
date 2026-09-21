import { app } from "../src/app.js";
import { connectDB } from "../src/config/connectDB.js";

await connectDB();

export default app;
