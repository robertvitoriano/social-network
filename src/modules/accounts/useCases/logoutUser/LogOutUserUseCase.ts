import { AppError } from "../../../../shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IFriendshipsRepository } from "../../../friendships/repositories/IFriendshipsRepository";
import { webSocketServer } from "../../../../shared/infra/http/server";
import { EventType } from "../../../../shared/enums/websocket-events";

interface IRequest {
  email: string;
  password: string;
}
interface IResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    username: string;
  };
  token: string;
}

@injectable()
export class LogoutUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository
  ) {}
  async execute(userId: string): Promise<void> {
    await this.usersRepository.updateOnlineStatus(userId, false);

    const io = webSocketServer.getIO();

    const friendIds = await this.friendshipRepository.getFriendIds(userId);

    io.to(friendIds).emit(EventType.FRIEND_LOGGED_OUT, userId);
  }
}
