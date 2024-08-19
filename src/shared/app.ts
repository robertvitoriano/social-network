// src/shared/infra/http/app.ts

import "reflect-metadata";
import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import { appErrorMiddleware } from "./infra/http/middlewares/appErrorMiddleware";
import { router } from "./infra/http/routes";
import swaggerConfig from "./../swagger.json";
import "./container";
dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PATCH"] }));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use(morgan("common"));
app.use(router);
app.use(appErrorMiddleware);
app.get("/", (request, response) => {
  response.json({ message: "My app is running" });
});

export { app };
