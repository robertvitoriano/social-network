import { DatabaseConnection } from "../typeorm/DatabaseConnection";
import http from "http";
import { WebSocketServer } from "../ws/WebSocketServer";
import { app } from "./../../app";

const dbConnection = new DatabaseConnection();
let webSocketServer;
dbConnection.connect().then(() => {
  const httpServer = http.createServer(app);
  webSocketServer = new WebSocketServer(httpServer);
  webSocketServer.init();

  httpServer.listen(3334, () => {
    console.info("My app is running");
  });
});

export { webSocketServer };
