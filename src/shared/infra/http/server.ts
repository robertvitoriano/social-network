import "reflect-metadata";
import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./../../../swagger.json";
import morgan from "morgan";
import { appErrorMiddleware } from "./middlewares/appErrorMiddleware";
import createConnection from "./../typeorm";
import "./../../container";
import { router } from "./routes";
import http from "http";
import { WebSocketServer } from "../ws/WebSocketServer";

createConnection();

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use(morgan("common"));
app.use(router);
app.use(appErrorMiddleware);

const httpServer = http.createServer(app);
const webSocketServer = new WebSocketServer(httpServer);
webSocketServer.init();

app.listen(3334, () => {
  console.info("My app is running");
});

export { webSocketServer };
