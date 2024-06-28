import { inject, injectable } from "tsyringe";
import ICreateUserDTO from "../../dtos/ICreateFriendshipDTO";
import { IFriendshipsRepository } from "../../repositories/IFriendshipsRepository";
import { AppError } from "@shared/errors/AppError";
import { IFriendshipUpdateDTO } from "@modules/friendships/dtos/IFriendshipUpdateDTO";
import { webSocketServer } from "@shared/infra/http/server";
import { EventType } from "@shared/enums/websocket-events";
import { ClientErrorHttpStatusCode } from "@shared/enums/http-status-codes";
import { FriendshipStatus } from "@shared/enums/friendship-status";

@injectable()
class SendFriendshipResponseUseCase {
  constructor(
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository
  ) {}

  async execute({
    friendId,
    userId,
    status,
  }: IFriendshipUpdateDTO): Promise<void> {
    const friendshipAlreadyExists =
      await this.friendshipRepository.findFriendship({ friendId, userId });

    if (friendshipAlreadyExists) {
      await this.friendshipRepository.update({ friendId, userId, status });

      if (status === FriendshipStatus.ACCEPTED) {
        const io = webSocketServer.getIO();

        io.to(friendId).emit(EventType.FRIENDSHIP_ACCEPTED, { userId });
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
