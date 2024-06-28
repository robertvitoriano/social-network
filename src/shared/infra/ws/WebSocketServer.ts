import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { EventType } from "@shared/enums/websocket-events";

class WebSocketServer {
  private io: SocketIOServer;

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
  }

  public init(): void {
    this.io.on("connection", (socket) => {
      console.log("User connected: ", socket.id);

      socket.on(EventType.USER_JOIN_ROOM, (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
      });
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}

export { WebSocketServer };
