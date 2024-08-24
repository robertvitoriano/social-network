import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../repositories/IChatRepository";
import { NotificationTypes } from "../../../../shared/enums/notification-types";
import { EventType } from "../../../../shared/enums/websocket-events";
import { WebSocketServer } from "./../../../../shared/infra/ws/WebSocketServer";
import { INotificationsRepository } from "../../../notifications/repositories/INotificationsRepository";
import { IFriendshipsRepository } from "../../../friendships/repositories/IFriendshipsRepository";

type ISendChatMessageUseCaseParams = {
  receiverId: string;
  senderId: string;
  content: string;
  userAvatar: string;
  userName: string;
  friendshipId: string;
};

@injectable()
class SendChatMessageUseCase {
  constructor(
    @inject("ChatRepository")
    private chatRepository: IChatRepository,
    @inject("NotificationRepository")
    private notificationsRepository: INotificationsRepository
  ) {}

  async execute({
    receiverId,
    senderId,
    content,
    userAvatar,
    userName,
    friendshipId,
  }: ISendChatMessageUseCaseParams): Promise<void> {
    const webSocketServer = WebSocketServer.getInstance();
    const io = webSocketServer.getIO();
    let notification = null;
    const friendChatIsOpen = webSocketServer.isFriendChatOpen({
      userId: receiverId,
      friendId: senderId,
    });
    if (!friendChatIsOpen) {
      notification = await this.notificationsRepository.create({
        notificationTypeId: NotificationTypes.MESSAGE_RECEIVED,
        receiverId,
        senderId,
      });

      io.to(receiverId).emit(EventType.MESSAGE_RECEIVED_NOTIFICATION, {
        id: notification?.id,
        senderAvatar: userAvatar,
        senderName: userName,
        senderId,
        createdAt: notification?.created_at,
        typeId: NotificationTypes.MESSAGE_RECEIVED,
        wasRead: false,
        content,
      });
    }

    io.to(receiverId).emit(EventType.MESSAGE_RECEIVED, {
      id: notification?.id,
      senderAvatar: userAvatar,
      senderName: userName,
      senderId,
      createdAt: notification?.created_at || new Date().toISOString(),
      eventType: EventType.MESSAGE_RECEIVED,
      wasRead: false,
      content,
    });

    await this.chatRepository.createMessage({
      notificationId: notification?.id,
      receiverId,
      senderId,
      content,
      friendshipId,
    });
  }
}

export { SendChatMessageUseCase };
