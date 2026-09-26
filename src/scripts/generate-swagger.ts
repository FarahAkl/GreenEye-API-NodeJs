import fs from "node:fs";
import path from "node:path";
import swaggerJSDoc from "swagger-jsdoc";

import { swaggerOptions } from "../config/swagger.js";

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const outputPath = path.resolve("src/config/swagger.generated.ts");

const output = `export const swaggerSpec = ${JSON.stringify(
  swaggerSpec,
  null,
  2,
)} as const;
`;

fs.writeFileSync(outputPath, output, "utf-8");

