import { inject, injectable } from "tsyringe";
import ICreateUserDTO from "../../dtos/ICreateFriendshipDTO";
import { IFriendshipsRepository } from "../../repositories/IFriendshipsRepository";
import { AppError } from "@shared/errors/AppError";
import { IFriendshipUpdateDTO } from "@modules/friendships/dtos/IFriendshipUpdateDTO";
import { webSocketServer } from "@shared/infra/http/server";
import { EventType } from "@shared/enums/websocket-events";
import { ClientErrorHttpStatusCode } from "@shared/enums/http-status-codes";
import { FriendshipStatus } from "@shared/enums/friendship-status";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { NotificationTypes } from "@shared/enums/notification-types";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

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
        console.log("FRIENDSHIP REQUEST ACCEPTED");
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
          type: EventType.FRIENDSHIP_ACCEPTED,
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
