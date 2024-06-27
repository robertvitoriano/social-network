import { IFriendshipsRepository } from "@modules/friendships/repositories/IFriendshipsRepository";
import ICreateFriendshipDTO from "../../dtos/ICreateFriendshipDTO";
import { IUserFriendDTO } from "../../dtos/IUserFriendDTO";
import { Friendship } from "../typeorm/entities/Friendship";
import { Repository, getRepository } from "typeorm";

class FriendshipRepository implements IFriendshipsRepository {
  private repository: Repository<Friendship>;

  constructor() {
    this.repository = getRepository(Friendship);
  }

  async findFriendship({
    friendId,
    userId,
  }: {
    userId: string;
    friendId: string;
  }): Promise<IUserFriendDTO | null> {
    const friendship = await this.repository
      .createQueryBuilder("friendships")
      .leftJoinAndSelect("friendships.user", "user")
      .leftJoinAndSelect("friendships.friend", "friend")
      .where(
        "friendships.user_id = :userId AND friendships.friend_id = :friendId",
        { userId, friendId }
      )
      .orWhere(
        "friendships.user_id = :friendId AND friendships.friend_id = :userId",
        { userId, friendId }
      )
      .select([
        "user.id",
        "user.name",
        "user.email",
        "user.username",
        "user.isAdmin",
        "user.created_at",
        "friend.id",
        "friend.name",
        "friend.email",
        "friend.username",
        "friend.isAdmin",
        "friend.created_at",
      ])
      .getOne();

    if (!friendship) {
      return null;
    }

    const { user, friend } = friendship;

    return {
      id: user.id === userId ? friend.id : user.id,
      name: user.id === userId ? friend.name : user.name,
      email: user.id === userId ? friend.email : user.email,
      username: user.id === userId ? friend.username : user.username,
      isAdmin: user.id === userId ? friend.isAdmin : user.isAdmin,
      created_at: user.id === userId ? friend.created_at : user.created_at,
    };
  }

  async create({ friendId, userId }: ICreateFriendshipDTO): Promise<void> {
    const friendship = this.repository.create({
      friend_id: friendId,
      user_id: userId,
      status: "pending",
    });
    await this.repository.save(friendship);
  }
  async update({ userId, friendId, status }): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update("friendships")
      .set({ status })
      .where("user_id = :userId AND friend_id = :friendId", {
        userId,
        friendId,
      })
      .orWhere("user_id = :friendId AND friend_id = :userId", {
        userId,
        friendId,
      })
      .execute();
  }
  async findUserFriends(userId: string): Promise<IUserFriendDTO[]> {
    const friends = await this.repository
      .createQueryBuilder("friendship")
      .leftJoinAndSelect("friendship.user", "user")
      .leftJoinAndSelect("friendship.friend", "friend")
      .where("friendship.user_id = :userId", { userId })
      .orWhere("friendship.friend_id = :userId", { userId })
      .select([
        "user.id",
        "user.name",
        "user.email",
        "user.username",
        "user.isAdmin",
        "user.created_at",
        "friend.id",
        "friend.name",
        "friend.email",
        "friend.username",
        "friend.isAdmin",
        "friend.created_at",
      ])
      .getMany();

    return friends.map((friendship) => {
      if (friendship.user.id === userId) {
        return {
          id: friendship.friend.id,
          name: friendship.friend.name,
          email: friendship.friend.email,
          username: friendship.friend.username,
          isAdmin: friendship.friend.isAdmin,
          created_at: friendship.friend.created_at,
        };
      } else {
        return {
          id: friendship.user.id,
          name: friendship.user.name,
          email: friendship.user.email,
          username: friendship.user.username,
          isAdmin: friendship.user.isAdmin,
          created_at: friendship.user.created_at,
        };
      }
    });
  }
}

export { FriendshipRepository };
