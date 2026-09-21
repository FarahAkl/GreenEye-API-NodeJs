import swaggerJSDoc from "swagger-jsdoc";

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
          type: "https",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: "https://localhost:5000",
        description: "Local server",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Admin",
        description: "Admin endpoints",
      },
      {
        name: "Supplier",
        description: "Supplier endpoints",
      },
      {
        name: "Profile",
        description: "Profile endpoints",
      },
      {
        name: "AI",
        description: "AI endpoints",
      },
      {
        name: "Category",
        description: "Category endpoints",
      },
    ],
  },

  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
