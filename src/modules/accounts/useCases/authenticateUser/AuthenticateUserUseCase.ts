import { AppError } from "../../../../shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { IUsersRepository } from "../../repositories/IUsersRepository";

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
    private usersRepository: IUsersRepository
  ) {}
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      console.log({ user });
      throw new AppError("Email or password invalid", 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password invalid", 401);
    }

    const token = sign({ name: user.name, email: user.email }, "secret", {
      subject: user.id,
      expiresIn: "1d",
    });

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
