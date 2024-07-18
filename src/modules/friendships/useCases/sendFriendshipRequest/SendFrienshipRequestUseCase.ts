import { inject, injectable } from "tsyringe";
import ICreateUserDTO from "../../dtos/ICreateFriendshipDTO";
import { IFriendshipsRepository } from "../../repositories/IFriendshipsRepository";
import { AppError } from "@shared/errors/AppError";
import { webSocketServer } from "@shared/infra/http/server";
import { ErrorMessages } from "@shared/enums/error-messages";
import { EventType } from "@shared/enums/websocket-events";
import { ClientErrorHttpStatusCode } from "@shared/enums/http-status-codes";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { NotificationTypes } from "@shared/enums/notification-types";

@injectable()
class SendFriendshipUseCase {
  constructor(
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository,
    private notificationsRepository: INotificationsRepository
  ) {}

  async execute({ friendId, userId }: ICreateUserDTO): Promise<void> {
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

    io.to(friendId).emit(EventType.FRIENDSHIP_REQUEST, { userId });
    await this.notificationsRepository.create({
      notificationTypeId: NotificationTypes.FRIENDSHIP_REQUEST,
      receiverId: friendId,
      senderId: userId,
    });
  }
}
export { SendFriendshipUseCase };
