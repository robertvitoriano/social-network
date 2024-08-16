import { sign } from "jsonwebtoken";
import { IUsersRepository } from "./../../repositories/IUsersRepository";
import axios from "axios";
import { inject, injectable } from "tsyringe";
import crypto from "crypto";
import { webSocketServer } from "../../../../shared/infra/http/server";
import { EventType } from "src/shared/enums/websocket-events";
import { IFriendshipsRepository } from "src/modules/friendships/repositories/IFriendshipsRepository";

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
    private usersRepository: IUsersRepository,
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository
  ) {}

  public async execute(oauthCode: string): Promise<IResponse> {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: oauthCode,
        grant_type: "authorization_code",
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { name, picture, email } = userInfoResponse.data;
    let user: any = await this.usersRepository.findByEmail(email);

    if (!user) {
      user = await this.usersRepository.create({
        email,
        name,
        password: this.generateRandomPassword(12),
        avatar: picture,
        username: email.split("@")[0],
      });
    }
    const token = sign({ name: user.name, email: user.email }, "secret", {
      subject: user.id,
      expiresIn: "1d",
    });
    await this.usersRepository.updateOnlineStatus(user.id, true);

    const io = webSocketServer.getIO();

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
  private generateRandomPassword(length: number): string {
    return crypto.randomBytes(length).toString("hex");
  }
}
