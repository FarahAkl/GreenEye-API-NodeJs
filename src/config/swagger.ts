import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesPath = path.resolve(__dirname, "../routes/*.ts");

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "GreenEye API",
      version: "1.0.0",
      description: "API documentation for GreenEye",
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    servers: [
      {
        url: "/",
        description: "Current deployment",
      },
    ],

    tags: [
      {
        name: "Auth",
      },
      {
        name: "Admin",
      },
      {
        name: "Supplier",
      },
      {
        name: "Profile",
      },
      {
        name: "AI",
      },
      {
        name: "Category",
      },
    ],
  },

  apis: [routesPath],
};

export const swaggerSpec = swaggerJSDoc(options);
