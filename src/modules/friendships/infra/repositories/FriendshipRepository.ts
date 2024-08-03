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
      .update("friendship")
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
    const rawFriends = await this.repository
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
        "user.id AS userId",
        "user.name AS userName",
        "user.email AS userEmail",
        "user.username AS userUsername",
        "user.isAdmin AS userIsAdmin",
        "user.created_at AS userCreatedAt",
        "friend.id AS friendId",
        "friend.name AS friendName",
        "friend.email AS friendEmail",
        "friend.username AS friendUsername",
        "friend.isAdmin AS friendIsAdmin",
        "friend.created_at AS friendCreatedAt",
      ])
      .getRawMany();

    const friends: IUserFriendDTO[] = rawFriends.map((rawFriend) => {
      const isUser = rawFriend.userId === userId;

      if (isUser)
        return {
          id: rawFriend.friendId,
          name: rawFriend.friendName,
          email: rawFriend.friendEmail,
          username: rawFriend.friendUsername,
          isAdmin: rawFriend.friendIsAdmin,
          createdAt: rawFriend.friendCreatedAt,
        };

      return {
        id: rawFriend.userId,
        name: rawFriend.userName,
        email: rawFriend.userEmail,
        username: rawFriend.userUsername,
        isAdmin: rawFriend.userIsAdmin,
        createdAt: rawFriend.userCreatedAt,
      };
    });

    return friends;
  }

  async findNonFriends(userId: string): Promise<IUserFriendDTO[] | any> {
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

    const pendingFriendshipQuery = this.repository
      .createQueryBuilder("friendship")
      .leftJoinAndSelect("friendship.user", "user")
      .leftJoinAndSelect("friendship.friend", "friend")
      .where("friendship.user_id = :userId AND friendship.status = 'pending'", {
        userId,
      })
      .orWhere(
        "friendship.friend_id = :userId AND friendship.status = 'pending'",
        { userId }
      );
    if (friendIds.length > 0) {
      pendingFriendshipQuery.andWhere("user.id NOT IN (:...friendIds)", {
        friendIds,
      });
    }

    const pendingFriendships = await pendingFriendshipQuery.getMany();

    const pendingFrienshipsFiltered = pendingFriendships.map((friendship) => {
      if (friendship.user.id === userId) {
        friendship.friend;
        return { ...friendship.friend, friendshipRequestStatus: "sent" };
      } else if (friendship.friend.id === userId) {
        return { ...friendship.user, friendshipRequestStatus: "received" };
      }
    });
    const pendingFriendsId = pendingFrienshipsFiltered.map((user) => user.id);

    const pendingAndAlreadyFriendsId = [...pendingFriendsId, ...friendIds];

    const userWithoutFriendshipRequestQuery = this.userRepository
      .createQueryBuilder("user")
      .where("user.id != :userId", { userId });

    if (pendingAndAlreadyFriendsId.length > 0) {
      userWithoutFriendshipRequestQuery.andWhere(
        "user.id NOT IN (:...pendingAndAlreadyFriendsId)",
        { pendingAndAlreadyFriendsId }
      );
    }

    const usersWithoutFriendshipRequest =
      await userWithoutFriendshipRequestQuery.getMany();

    const nonFriendsWithFriendshipRequestStatus =
      usersWithoutFriendshipRequest.map((friendship) => ({
        ...friendship,
        friendshipRequestStatus: "not_sent",
      }));

    return [
      ...pendingFrienshipsFiltered,
      ...nonFriendsWithFriendshipRequestStatus,
    ];
  }
}

export { FriendshipRepository };
