import { AppError } from "../../../../shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { hash } from "bcrypt";
import { WebSocketServer } from "./../../../../shared/infra/ws/WebSocketServer";
import { sign } from "jsonwebtoken";
import { EventType } from "./../../../../shared/enums/websocket-events";
import { IFriendshipsRepository } from "./../../../../modules/friendships/repositories/IFriendshipsRepository";

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
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private userRepository: IUsersRepository,
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository
  ) {}

  async execute({
    name,
    username,
    email,
    password,
    isAdmin,
  }: ICreateUserDTO): Promise<IResponse> {
    const hashedPassword = await hash(password, 8);

    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) throw new AppError("User already exists", 400);

    const user = await this.userRepository.create({
      name,
      username,
      email,
      isAdmin,
      password: hashedPassword,
    });
    await this.userRepository.updateOnlineStatus(user.id, true);
    const webSocketServer = WebSocketServer.getInstance();
    const io = webSocketServer.getIO();

    const token = sign({ name, email }, "secret", {
      subject: user.id,
      expiresIn: 20,
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
export { CreateUserUseCase };
