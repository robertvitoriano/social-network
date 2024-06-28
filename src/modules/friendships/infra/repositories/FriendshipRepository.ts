import { IFriendshipsRepository } from "@modules/friendships/repositories/IFriendshipsRepository";
import ICreateFriendshipDTO from "../../dtos/ICreateFriendshipDTO";
import { IUserFriendDTO } from "../../dtos/IUserFriendDTO";
import { Friendship } from "../typeorm/entities/Friendship";
import { User } from "@modules/accounts/infra/typeorm/entities/User"; // Assuming the User entity is located here
import { Repository, getRepository, Not, In } from "typeorm";

class FriendshipRepository implements IFriendshipsRepository {
  private repository: Repository<Friendship>;
  private userRepository: Repository<User>; // Add a repository for User

  constructor() {
    this.repository = getRepository(Friendship);
    this.userRepository = getRepository(User); // Initialize User repository
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

  // New method to find non-friends
  async findNonFriends(userId: string): Promise<IUserFriendDTO[]> {
    // First, find all the friend IDs of the user
    const friends = await this.repository
      .createQueryBuilder("friendship")
      .where(
        "(friendship.user_id = :userId OR friendship.friend_id = :userId) AND friendship.status = 'accepted'",
        { userId }
      )
      .select(["friendship.user_id", "friendship.friend_id"])
      .getMany();

    const friendIds = friends.map((friendship) =>
      friendship.user_id === userId ? friendship.friend_id : friendship.user_id
    );

    // Find all users who are not friends
    const nonFriends = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id != :userId", { userId })
      .andWhere("user.id NOT IN (:...friendIds)", { friendIds })
      .select([
        "user.id",
        "user.name",
        "user.email",
        "user.username",
        "user.isAdmin",
        "user.created_at",
      ])
      .getMany();

    return nonFriends.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      created_at: user.created_at,
    }));
  }
}

export { FriendshipRepository };
