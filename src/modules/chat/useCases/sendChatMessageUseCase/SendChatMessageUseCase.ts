import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../repositories/IChatRepository";
import { NotificationTypes } from "../../../../shared/enums/notification-types";
import { EventType } from "../../../../shared/enums/websocket-events";
import { webSocketServer } from "../../../../shared/infra/http/server";
import { INotificationsRepository } from "../../../notifications/repositories/INotificationsRepository";

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
    const io = webSocketServer.getIO();

    const notificationCreated = await this.notificationsRepository.create({
      notificationTypeId: NotificationTypes.MESSAGE_RECEIVED,
      receiverId,
      senderId,
    });

    io.to(receiverId).emit(EventType.MESSAGE_RECEIVED, {
      id: notificationCreated.id,
      senderAvatar: userAvatar,
      senderName: userName,
      senderId,
      createdAt: notificationCreated.created_at,
      type: EventType.MESSAGE_RECEIVED,
      wasRead: false,
      content,
    });

    await this.chatRepository.createMessage({
      notificationId: notificationCreated.id,
      receiverId,
      senderId,
      content,
    });
  }
}

export { SendChatMessageUseCase };
