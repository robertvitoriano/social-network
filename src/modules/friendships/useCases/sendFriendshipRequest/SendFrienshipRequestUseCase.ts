import { inject, injectable } from "tsyringe";
import ICreateFriendshipDTO from "../../dtos/ICreateFriendshipDTO";
import { IFriendshipsRepository } from "../../repositories/IFriendshipsRepository";
import { ErrorMessages } from "../../../../shared/enums/error-messages";
import { FriendshipStatus } from "../../../../shared/enums/friendship-status";
import { ClientErrorHttpStatusCode } from "../../../../shared/enums/http-status-codes";
import { NotificationTypes } from "../../../../shared/enums/notification-types";
import { EventType } from "../../../../shared/enums/websocket-events";
import { AppError } from "../../../../shared/errors/AppError";
import { WebSocketServer } from "./../../../../shared/infra/ws/WebSocketServer";
import { INotificationsRepository } from "../../../notifications/repositories/INotificationsRepository";

@injectable()
class SendFriendshipUseCase {
  constructor(
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository,
    @inject("NotificationRepository")
    private notificationsRepository: INotificationsRepository
  ) {}

  async execute({
    friendId,
    userId,
    userName,
    userAvatar,
  }: ICreateFriendshipDTO): Promise<void> {
    const friendshipAlreadyExists =
      await this.friendshipRepository.findFriendship({ friendId, userId });

    if (friendshipAlreadyExists) {
      throw new AppError(
        ErrorMessages.FRIENDSHIP_ALREADY_EXISTS,
        ClientErrorHttpStatusCode.BAD_REQUEST
      );
    }
    const webSocketServer = WebSocketServer.getInstance();
    const io = webSocketServer.getIO();

    const friendshipRequestNotificationCreated =
      await this.notificationsRepository.create({
        notificationTypeId: NotificationTypes.FRIENDSHIP_REQUEST,
        receiverId: friendId,
        senderId: userId,
      });
    await this.friendshipRepository.create({
      userId,
      friendId,
      requestNotificationId: friendshipRequestNotificationCreated.id,
    });

    io.to(friendId).emit(EventType.FRIENDSHIP_REQUEST, {
      id: friendshipRequestNotificationCreated.id,
      senderAvatar: userAvatar,
      senderName: userName,
      senderId: userId,
      createdAt: friendshipRequestNotificationCreated.created_at,
      typeId: NotificationTypes.FRIENDSHIP_REQUEST,
      friendshipRequestStatus: FriendshipStatus.PENDING,
      wasRead: false,
    });
  }
}
export { SendFriendshipUseCase };
