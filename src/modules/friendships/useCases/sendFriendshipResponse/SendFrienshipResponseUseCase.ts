import { inject, injectable } from "tsyringe";
import ICreateUserDTO from "../../dtos/ICreateFriendshipDTO";
import { IFriendshipsRepository } from "../../repositories/IFriendshipsRepository";
import { AppError } from "@shared/errors/AppError";
import { IFriendshipUpdateDTO } from "@modules/friendships/dtos/IFriendshipUpdateDTO";

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
    } else {
      throw new AppError("Friendship not found", 404);
    }
  }
}
export { SendFriendshipResponseUseCase };
