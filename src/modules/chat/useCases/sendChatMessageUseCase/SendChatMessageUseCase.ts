import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../repositories/IChatRepository";
import { NotificationTypes } from "../../../../shared/enums/notification-types";
import { EventType } from "../../../../shared/enums/websocket-events";
import { WebSocketServer } from "./../../../../shared/infra/ws/WebSocketServer";
import { INotificationsRepository } from "../../../notifications/repositories/INotificationsRepository";
import { IUsersRepository } from "../../../accounts/repositories/IUsersRepository";

type ISendChatMessageUseCaseParams = {
  receiverId: string;
  senderId: string;
  content: string;
  userAvatar: string;
  userName: string;
};

@injectable()
class SendChatMessageUseCase {
  constructor(
    @inject("ChatRepository")
    private chatRepository: IChatRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("NotificationRepository")
    private notificationsRepository: INotificationsRepository
  ) {}

  async execute({
    receiverId,
    senderId,
    content,
    userAvatar,
    userName,
  }: ISendChatMessageUseCaseParams): Promise<void> {
    const webSocketServer = WebSocketServer.getInstance();
    const io = webSocketServer.getIO();
    let notification = null;
    const friendChatIsOpen = webSocketServer.isFriendChatOpen({
      userId: receiverId,
      friendId: senderId,
    });
    console.log({ friendChatIsOpen });
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
      createdAt: notification?.created_at,
      eventType: EventType.MESSAGE_RECEIVED,
      wasRead: false,
      content,
    });

    await this.chatRepository.createMessage({
      notificationId: notification?.id,
      receiverId,
      senderId,
      content,
    });
  }
}

export { SendChatMessageUseCase };
