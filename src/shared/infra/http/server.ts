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
import cors from "cors";
import AWS from "aws-sdk";
import { EventType } from "@shared/enums/websocket-events";
import { Server, Socket } from "socket.io";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

createConnection();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use(morgan("common"));
app.use(router);
app.use(appErrorMiddleware);

const httpServer = http.createServer(app);
const webSocketServer = new WebSocketServer(httpServer);
webSocketServer.init();
const io: Server = webSocketServer.getIO();

io.on("connection", (socket: Socket) => {
  socket.on(EventType.USER_TYPING, (receiverId: string) => {
    if (io.sockets.adapter.rooms.has(receiverId)) {
      socket.to(receiverId).emit(EventType.USER_TYPING);
    }
  });
  socket.on(EventType.USER_TYPING_STOPPED, (receiverId: string) => {
    if (io.sockets.adapter.rooms.has(receiverId)) {
      socket.to(receiverId).emit(EventType.USER_TYPING_STOPPED);
    }
  });
});

httpServer.listen(3334, () => {
  console.info("My app is running");
});

export { webSocketServer };
