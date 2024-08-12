import "reflect-metadata";
import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./../../../swagger.json";
import morgan from "morgan";
import { appErrorMiddleware } from "./middlewares/appErrorMiddleware";
import { DatabaseConnection } from "../typeorm/DatabaseConnection";
import "./../../container";
import { router } from "./routes";
import http from "http";
import { WebSocketServer } from "../ws/WebSocketServer";
import cors from "cors";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const dbConnection = new DatabaseConnection();
dbConnection.connect();

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
app.post("/log-in", async (req, res) => {
  try {
    console.log("my post route worked");
  } catch (error) {
    console.error("POST route error:", error);
    res.status(500).send("Internal Server Error");
  }
});
const httpServer = http.createServer(app);
const webSocketServer = new WebSocketServer(httpServer);
webSocketServer.init();

httpServer.listen(3334, () => {
  console.info("My app is running");
});

export { webSocketServer };
