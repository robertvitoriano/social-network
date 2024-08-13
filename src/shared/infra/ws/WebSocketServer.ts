import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { EventType } from "../../enums/websocket-events";

class WebSocketServer {
  private io: SocketIOServer;

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PATCH"],
      },
    });
  }

  public init(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("User connected: ", socket.id);

      socket.on(EventType.USER_JOIN_ROOM, (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
      });
      socket.on(EventType.USER_TYPING, (receiverId: string) => {
        if (this.io.sockets.adapter.rooms.has(receiverId)) {
          socket.to(receiverId).emit(EventType.USER_TYPING);
        }
      });
      socket.on(EventType.USER_TYPING_STOPPED, (receiverId: string) => {
        if (this.io.sockets.adapter.rooms.has(receiverId)) {
          socket.to(receiverId).emit(EventType.USER_TYPING_STOPPED);
        }
      });
      socket.on(EventType.MESSAGE_SENT, ({ receiverId, ...newMessage }) => {
        if (this.io.sockets.adapter.rooms.has(newMessage.receiverId)) {
          console.log({ receiverId, ...newMessage });
          socket
            .to(newMessage.receiverId)
            .emit(EventType.MESSAGE_RECEIVED, newMessage);
        }
      });
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}

export { WebSocketServer };
