import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { EventType } from "../../enums/websocket-events";

export class WebSocketServer {
  private static instance: WebSocketServer;
  private io: SocketIOServer;
  private chatState: Map<string, boolean>;

  private constructor() {
    this.chatState = new Map();
  }

  public static getInstance(): WebSocketServer {
    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer();
    }
    return WebSocketServer.instance;
  }

  public init(server: HttpServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PATCH"],
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log("User connected: ", socket.id);

      socket.on(EventType.USER_JOIN_ROOM, (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
      });

      socket.on(EventType.CHAT_OPEN, ({ userId, friendId }) => {
        if (!this.chatState.get(`${userId}_${friendId}`)) {
          this.chatState.set(`${userId}_${friendId}`, true);
        }
      });

      socket.on(EventType.CHAT_CLOSE, ({ userId, friendId }) => {
        this.chatState.set(`${userId}_${friendId}`, false);
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
    });
  }

  public getChatState(): Map<string, boolean> {
    return this.chatState;
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}
