import { IFriendshipsRepository } from "@modules/friendships/repositories/IFriendshipsRepository";
import ICreateFriendshipDTO from "@modules/friendships/dtos/ICreateFriendshipDTO";
import { IUserFriendDTO } from "@modules/friendships/dtos/IUserFriendDTO";
import { Friendship } from "../typeorm/entities/Friendship";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Repository, getRepository, Not, In } from "typeorm";

class FriendshipRepository implements IFriendshipsRepository {
  private repository: Repository<Friendship>;
  private userRepository: Repository<User>;

  constructor() {
    this.repository = getRepository(Friendship);
    this.userRepository = getRepository(User);
  }

  async findFriendship({
    friendId,
    userId,
  }: {
    userId: string;
    friendId: string;
  }): Promise<IUserFriendDTO | null> {
    try {
      const friendship = await getRepository(Friendship)
        .createQueryBuilder("friendship")
        .leftJoinAndMapOne(
          "friendship.user",
          User,
          "user",
          "friendship.user_id = user.id"
        )
        .leftJoinAndMapOne(
          "friendship.friend",
          User,
          "friend",
          "friendship.friend_id = friend.id"
        )
        .where(
          "(friendship.user_id = :userId AND friendship.friend_id = :friendId) OR (friendship.user_id = :friendId AND friendship.friend_id = :userId)",
          { userId, friendId }
        )
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
    } catch (error) {
      console.error("Error executing query:", error);
      return null;
    }
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
      .update("friendshi")
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
      .where(
        "friendship.user_id = :userId AND friendship.status = 'accepted'",
        { userId }
      )
      .orWhere(
        "friendship.friend_id = :userId AND friendship.status = 'accepted'",
        { userId }
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

  async findNonFriends(userId: string): Promise<IUserFriendDTO[]> {
    const friendships = await this.repository
      .createQueryBuilder("friendship")
      .where(
        "(friendship.user_id = :userId OR friendship.friend_id = :userId) AND friendship.status = 'accepted'",
        { userId }
      )
      .select(["friendship.user_id", "friendship.friend_id"])
      .getMany();

    const friendIds = friendships.map((friendship) =>
      friendship.user_id === userId ? friendship.friend_id : friendship.user_id
    );

    const nonFriendsQuery = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect(
        "friendship",
        "friendshipSent",
        "friendshipSent.user_id = :userId AND friendshipSent.friend_id = user.id AND friendshipSent.status = 'pending'",
        { userId }
      )
      .leftJoinAndSelect(
        "friendship",
        "friendshipReceived",
        "friendshipReceived.friend_id = :userId AND friendshipReceived.user_id = user.id AND friendshipReceived.status = 'pending'",
        { userId }
      )
      .where("user.id != :userId", { userId });

    if (friendIds.length > 0) {
      nonFriendsQuery.andWhere("user.id NOT IN (:...friendIds)", { friendIds });
    }

    const nonFriends = await nonFriendsQuery
      .select([
        "user.id",
        "user.name",
        "user.email",
        "user.username",
        "user.isAdmin",
        "user.created_at",
        "friendshipSent.id",
        "friendshipReceived.id",
      ])
      .getMany();
    console.log({ nonFriends });
    return nonFriends.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      created_at: user.created_at,
      //@ts-ignore
      friendshipRequestStatus: user.friendshipSent?.id
        ? "sent"
        : //@ts-ignore
        user.friendshipReceived?.id
        ? "received"
        : "not_sent",
    }));
  }
}

export { FriendshipRepository };
