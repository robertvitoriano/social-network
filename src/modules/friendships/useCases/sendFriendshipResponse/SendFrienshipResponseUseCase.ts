import { inject, injectable } from "tsyringe";
import ICreateUserDTO from "../../dtos/ICreateFriendshipDTO";
import { IFriendshipsRepository } from "../../repositories/IFriendshipsRepository";
import { IUsersRepository } from "../../../accounts/repositories/IUsersRepository";
import { INotificationsRepository } from "../../../notifications/repositories/INotificationsRepository";
import { IFriendshipUpdateDTO } from "../../dtos/IFriendshipUpdateDTO";
import { FriendshipStatus } from "../../../../shared/enums/friendship-status";
import { WebSocketServer } from "./../../../../shared/infra/ws/WebSocketServer";
import { NotificationTypes } from "../../../../shared/enums/notification-types";
import { EventType } from "../../../../shared/enums/websocket-events";
import { ClientErrorHttpStatusCode } from "../../../../shared/enums/http-status-codes";
import { AppError } from "../../../../shared/errors/AppError";

@injectable()
class SendFriendshipResponseUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository,
    @inject("NotificationRepository")
    private notificationsRepository: INotificationsRepository
  ) {}

  async execute({
    friendId,
    userId,
    status,
    userAvatar,
    userName,
  }: IFriendshipUpdateDTO): Promise<void> {
    const friendshipAlreadyExists =
      await this.friendshipRepository.findFriendship({ friendId, userId });

    if (friendshipAlreadyExists) {
      await this.friendshipRepository.update({ friendId, userId, status });

      if (status === FriendshipStatus.ACCEPTED) {
        const webSocketServer = WebSocketServer.getInstance();
        const io = webSocketServer.getIO();
        const notificationCreated = await this.notificationsRepository.create({
          notificationTypeId: NotificationTypes.FRIENDSHIP_ACCEPTED,
          receiverId: friendId,
          senderId: userId,
        });
        io.to(friendId).emit(EventType.FRIENDSHIP_ACCEPTED, {
          id: notificationCreated.id,
          senderAvatar: userAvatar,
          senderName: userName,
          senderId: userId,
          createdAt: notificationCreated.created_at,
          typeId: NotificationTypes.FRIENDSHIP_ACCEPTED,
          wasRead: false,
        });
      }
    } else {
      throw new AppError(
        "Friendship not found",
        ClientErrorHttpStatusCode.NOT_FOUND
      );
    }
  }
}
export { SendFriendshipResponseUseCase };
