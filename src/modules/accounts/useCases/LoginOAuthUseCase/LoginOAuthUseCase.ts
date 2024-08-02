import { sign } from "jsonwebtoken";
import { IUsersRepository } from "./../../repositories/IUsersRepository";

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
export class LoginOAuthUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute(profile: any): Promise<IResponse> {
    const { name, email, picture } = profile._json;

    let user: any = await this.usersRepository.findByEmail(email);

    if (!user) {
      user = await this.usersRepository.create({
        email,
        name,
        avatar: picture,
        username: email.split("@")[0],
      });
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
}
