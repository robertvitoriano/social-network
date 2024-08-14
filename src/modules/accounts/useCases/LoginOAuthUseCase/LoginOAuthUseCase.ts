import { sign } from "jsonwebtoken";
import { IUsersRepository } from "./../../repositories/IUsersRepository";
import axios from "axios";
import { inject, injectable } from "tsyringe";

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
export class LoginOAuthUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  public async execute(oauthCode: string): Promise<void> {
    const oauthRequest = {
      url: new URL("https://oauth2.googleapis.com/token"),
      params: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: oauthCode,
        grant_type: "authorization_code",
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      },
    };
    const oauthResponse = await axios.post(oauthRequest.url.toString(), null, {
      params: oauthRequest.params,
    });
    console.log(oauthResponse);

    //let user: any = await this.usersRepository.findByEmail(email);

    // if (!user) {
    //   user = await this.usersRepository.create({
    //     email,
    //     name,
    //     avatar: picture,
    //     username: email.split("@")[0],
    //   });
    //   const token = sign({ name: user.name, email: user.email }, "secret", {
    //     subject: user.id,
    //     expiresIn: "1d",
    //   });

    //   return {
    //     user: {
    //       id: user.id,
    //       name: user.name,
    //       email: user.email,
    //       avatar: user.avatar,
    //       username: user.username,
    //     },
    //     token: token,
    //   };
    // }
  }
}
