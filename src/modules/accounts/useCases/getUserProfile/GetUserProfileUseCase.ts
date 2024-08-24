import { IUsersRepository } from "./../../repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { IFriendshipsRepository } from "../../../friendships/repositories/IFriendshipsRepository";
import { User } from "../../infra/typeorm/entities/User";

interface IResponse {
  profile: User;
}
@injectable()
export class GetUserProfileUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository
  ) {}

  public async execute(userId: string): Promise<IResponse> {
    const profile = await this.usersRepository.findById(userId);
    return {
      profile,
    };
  }
}
