/// <reference path="./types/express.d.ts" />

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressRateLimit from "express-rate-limit";
// import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.generated.js";
import { errorResponse } from "./utils/helper.js";
import { errorHandler } from "./middleware/errorHandler.js";

import { aiRouter } from "./routes/ai.route.js";
import { authRouter } from "./routes/auth.route.js";
import { profileRouter } from "./routes/profile.route.js";
import { categoryRouter } from "./routes/category.route.js";
import { supplierRouter } from "./routes/supplier.route.js";
import { adminRouter } from "./routes/admin.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(
  expressRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/swagger.json", (_req, res) => {
  res.json(swaggerSpec);
});

app.get(["/swagger", "/swagger/"], (_req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>GreenEye API Documentation</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css"
        />
      </head>
      <body>
        <div id="swagger-ui"></div>

        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            url: "/swagger.json",
            dom_id: "#swagger-ui",
            deepLinking: true,
            presets: [SwaggerUIBundle.presets.apis],
            layout: "BaseLayout"
          });
        </script>
      </body>
    </html>
  `);
});

app.use("/api/ai", aiRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/profile", profileRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/marketplace/category", categoryRouter);

app.all("/{*splat}", (req, res) => {
  res.status(404).json(errorResponse("This resource is not available", null));
});

app.use(errorHandler);

export { app };
