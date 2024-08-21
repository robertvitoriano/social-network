import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { EventType } from "../../enums/websocket-events";
import { UserRepository } from "../../../modules/accounts/infra/repositories/UsersRepository";
import { container } from "tsyringe";
import { LogoutUserUseCase } from "../../../modules/accounts/useCases/logoutUser/LogOutUserUseCase";
import { FriendshipRepository } from "../../../modules/friendships/infra/repositories/FriendshipRepository";
export class WebSocketServer {
  private static instance: WebSocketServer;
  private io: SocketIOServer;
  private chatState: Map<string, Map<string, boolean>>;
  private timeToResetChatState = 5 * 60 * 1000;

  private constructor() {
    this.chatState = new Map();

    setInterval(() => {
      this.resetChatState();
    }, this.timeToResetChatState);
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
      console.info("User connected: ", socket.id);

      socket.on(EventType.USER_JOIN_ROOM, (userId) => {
        socket.join(userId);
        console.info(`User ${userId} joined room ${userId}`);
      });

      socket.on(EventType.CHAT_OPEN, ({ userId, friendId }) => {
        if (!this.chatState.has(userId)) {
          this.chatState.set(userId, new Map<string, boolean>());
        }

        const userChatState = this.chatState.get(userId);
        if (userChatState) {
          if (!userChatState.get(friendId)) {
            userChatState.set(friendId, true);
            console.info(`User ${userId} opened chat with ${friendId}`);
          }
        }
      });

      socket.on(EventType.CHAT_CLOSE, ({ userId, friendId }) => {
        const userChatState = this.chatState.get(userId);
        if (userChatState) {
          userChatState.set(friendId, false);
          console.info(`User ${userId} closed chat with ${friendId}`);
        }
      });

      socket.on("disconnect", () => {
        console.info("User disconnected: ", socket.id);
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
      socket.on(EventType.USER_ONLINE, async ({ userId }) => {
        const userRepository = new UserRepository();
        const friendshipRepository = new FriendshipRepository();
        const friendIds = await friendshipRepository.getFriendIds(userId);
        socket.to(friendIds).emit(EventType.FRIEND_LOGGED_IN, userId);

        await userRepository.updateOnlineStatus(userId, true);
      });
      socket.on(EventType.USER_OFFLINE, async ({ userId }) => {
        const logoutUserUseCase = container.resolve(LogoutUserUseCase);
        await logoutUserUseCase.execute(userId);
      });
    });
  }

  private resetChatState(): void {
    console.info("Resetting chat states...");
    this.chatState.forEach((friendChatState) => {
      friendChatState.forEach((_, friendId) => {
        friendChatState.set(friendId, false);
      });
    });
  }

  public getChatState(): Map<string, Map<string, boolean>> {
    return this.chatState;
  }

  public isFriendChatOpen({ userId, friendId }): boolean {
    const userChatState = this.chatState.get(userId);
    if (userChatState) {
      return userChatState.get(friendId);
    }
    return false;
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}
