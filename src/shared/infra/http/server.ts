import { DatabaseConnection } from "../typeorm/DatabaseConnection";
import http from "http";
import { WebSocketServer } from "../ws/WebSocketServer";
import { app } from "./../../app";

const dbConnection = new DatabaseConnection();
let webSocketServer;
dbConnection.connect().then(() => {
  const httpServer = http.createServer(app);
  const webSocketServer = WebSocketServer.getInstance();
  webSocketServer.init(httpServer);

  httpServer.listen(process.env.PORT, () => {
    console.info("My app is running on PORT " + process.env.PORT);
  });
});
