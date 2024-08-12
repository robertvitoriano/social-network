import { AppError } from "../../../../shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { EventType } from "../../../../shared/enums/websocket-events";
import { webSocketServer } from "../../../../shared/infra/http/server";
import { IFriendshipsRepository } from "../../../friendships/repositories/IFriendshipsRepository";

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
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository
  ) {}
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Email or password invalid", 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password invalid", 401);
    }

    await this.usersRepository.updateOnlineStatus(user.id, true);
    const io = webSocketServer.getIO();

    const token = sign({ name: user.name, email: user.email }, "secret", {
      subject: user.id,
      expiresIn: "1d",
    });
    const friendIds = await this.friendshipRepository.getFriendIds(user.id);

    io.to(friendIds).emit(EventType.FRIEND_LOGGED_IN, user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        username: user.username,
      },
      token: token,
    };
  }
}
