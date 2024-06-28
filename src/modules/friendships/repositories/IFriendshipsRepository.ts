import { IUserFriendDTO } from "../dtos/IUserFriendDTO";
import ICreateFriendshipDTO from "./../dtos/ICreateFriendshipDTO";

interface IFriendshipsRepository {
  create(data: ICreateFriendshipDTO): Promise<void>;
  findFriendship(data: {
    userId: string;
    friendId: string;
  }): Promise<IUserFriendDTO>;
  findUserFriends(userId: string): Promise<IUserFriendDTO[]>;
  findNonFriends(userId: string): Promise<IUserFriendDTO[]>;
  update(data: {
    friendId: string;
    userId: string;
    status: "accepted" | "rejected";
  }): Promise<void>;
}

export { IFriendshipsRepository };
