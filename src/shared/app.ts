import "reflect-metadata";
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import { appErrorMiddleware } from "./infra/http/middlewares/appErrorMiddleware";
import { router } from "./infra/http/routes";
import "./container";
import { Redis } from "./infra/redis";
import { rateLimiter } from "./infra/http/middlewares/rate-limiter";
import { env } from "src/config/env";
dotenv.config();

AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
});
Redis.connect().then(() => {
  console.info("Redis connection stablished!");
});
const app = express();
app.set("trust proxy", true);
app.use((req, res, next) => rateLimiter(req, res, next, 60, 60, 2 * 60 * 60));
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PATCH"] }));
app.use(express.json());
app.use(morgan("common"));
app.use(router);
app.use(appErrorMiddleware);
app.get("/", (request, response) => {
  response.json({ message: "My app is running" });
});

export { app };
