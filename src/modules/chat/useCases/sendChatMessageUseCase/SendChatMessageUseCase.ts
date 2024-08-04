import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../repositories/IChatRepository";
import { webSocketServer } from "@shared/infra/http/server";
import { EventType } from "@shared/enums/websocket-events";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { NotificationTypes } from "@shared/enums/notification-types";

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

    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository
  ) {}

  async execute({
    receiverId,
    senderId,
    content,
    userAvatar,
    userName,
  }: ISendChatMessageUseCaseParams): Promise<void> {
    await this.chatRepository.createMessage({
      receiverId,
      senderId,
      content,
    });

    const io = webSocketServer.getIO();

    const notificationCreated = await this.notificationsRepository.create({
      notificationTypeId: NotificationTypes.MESSAGE_SENT,
      receiverId,
      senderId,
    });

    io.to(receiverId).emit(EventType.MESSAGE_SENT, {
      id: notificationCreated.id,
      senderAvatar: userAvatar,
      senderName: userName,
      senderId,
      createdAt: notificationCreated.created_at,
      type: EventType.MESSAGE_SENT,
      wasRead: false,
    });
  }
}

export { SendChatMessageUseCase };
