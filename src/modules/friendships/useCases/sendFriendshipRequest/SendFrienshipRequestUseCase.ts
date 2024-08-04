import { inject, injectable } from "tsyringe";
import ICreateFriendshipDTO from "../../dtos/ICreateFriendshipDTO";
import { IFriendshipsRepository } from "../../repositories/IFriendshipsRepository";
import { AppError } from "@shared/errors/AppError";
import { webSocketServer } from "@shared/infra/http/server";
import { ErrorMessages } from "@shared/enums/error-messages";
import { EventType } from "@shared/enums/websocket-events";
import { ClientErrorHttpStatusCode } from "@shared/enums/http-status-codes";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { NotificationTypes } from "@shared/enums/notification-types";
import { FriendshipStatus } from "@shared/enums/friendship-status";

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

    await this.friendshipRepository.create({ userId, friendId });
    const io = webSocketServer.getIO();

    const notificationCreated = await this.notificationsRepository.create({
      notificationTypeId: NotificationTypes.FRIENDSHIP_REQUEST,
      receiverId: friendId,
      senderId: userId,
    });
    io.to(friendId).emit(EventType.FRIENDSHIP_REQUEST, {
      id: notificationCreated.id,
      senderAvatar: userAvatar,
      senderName: userName,
      senderId: userId,
      createdAt: notificationCreated.created_at,
      type: EventType.FRIENDSHIP_REQUEST,
      friendshipRequestStatus: FriendshipStatus.PENDING,
      wasRead: false,
    });
  }
}
export { SendFriendshipUseCase };
