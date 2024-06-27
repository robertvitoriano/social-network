import { inject, injectable } from "tsyringe";
import { IFriendshipsRepository } from "../../repositories/IFriendshipsRepository";
import { AppError } from "@shared/errors/AppError";
import { IUserFriendDTO } from "@modules/friendships/dtos/IUserFriendDTO";

@injectable()
class ListUserFriendsUseCase {
  constructor(
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository
  ) {}

  async execute(userId: string): Promise<IUserFriendDTO[]> {
    const userFriends = await this.friendshipRepository.findUserFriends(userId);
    return userFriends;
  }
}
export { ListUserFriendsUseCase };
