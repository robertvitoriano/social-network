import { inject, injectable } from "tsyringe";
import { IFriendshipsRepository } from "../../repositories/IFriendshipsRepository";
import { IUserFriendDTO } from "@modules/friendships/dtos/IUserFriendDTO";

@injectable()
class ListUserNonFriendsUseCase {
  constructor(
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository
  ) {}

  async execute(userId: string): Promise<IUserFriendDTO[]> {
    const nonFriends = await this.friendshipRepository.findNonFriends(userId);
    return nonFriends;
  }
}
export { ListUserNonFriendsUseCase };
