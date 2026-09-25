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
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
