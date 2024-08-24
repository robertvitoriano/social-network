import { User } from "../../../accounts/infra/typeorm/entities/User";
import ICreateFriendshipDTO from "../../dtos/ICreateFriendshipDTO";
import { IUserFriendDTO } from "../../dtos/IUserFriendDTO";
import { IFriendshipsRepository } from "../../repositories/IFriendshipsRepository";
import { Friendship } from "../typeorm/entities/Friendship";
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
        avatar: user.id === userId ? friend.avatar : user.avatar,
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

  async create({
    friendId,
    userId,
    requestNotificationId,
  }: ICreateFriendshipDTO): Promise<void> {
    const friendship = this.repository.create({
      friend_id: friendId,
      user_id: userId,
      status: "pending",
      request_notification_id: requestNotificationId,
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
      .leftJoin(
        (subQuery) =>
          subQuery
            .select("messages.id", "id")
            .addSelect("messages.sender_id", "sender_id")
            .addSelect("messages.receiver_id", "receiver_id")
            .addSelect("messages.content", "content")
            .addSelect("messages.created_at", "created_at")
            .from("messages", "messages")
            .where(
              `(messages.sender_id = :userId ) 
              OR (messages.receiver_id = :userId)`,
              { userId }
            )
            .orderBy("messages.created_at", "DESC")
            .limit(1),
        "last_message",
        `(last_message.receiver_id = friendship.friend_id AND last_message.sender_id = friendship.user_id) OR 
         (last_message.receiver_id = friendship.user_id AND last_message.sender_id = friendship.friend_id)`
      )
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
        "user.online AS userOnline",
        "user.name AS userName",
        "user.email AS userEmail",
        "user.avatar AS userAvatar",
        "user.username AS userUsername",
        "user.created_at AS userCreatedAt",
        "friend.id AS friendId",
        "friend.online AS friendOnline",
        "friend.name AS friendName",
        "friend.email AS friendEmail",
        "friend.avatar AS friendAvatar",
        "friend.username AS friendUsername",
        "friend.created_at AS friendCreatedAt",
        "last_message.content AS lastMessageContent",
        "last_message.created_at AS lastMessageCreatedAt",
      ])
      .getRawMany();

    const friends: IUserFriendDTO[] = rawFriends.map((rawFriend) => {
      const isUser = rawFriend.userId === userId;

      return {
        id: isUser ? rawFriend.friendId : rawFriend.userId,
        online: isUser ? rawFriend.friendOnline : rawFriend.userOnline,
        name: isUser ? rawFriend.friendName : rawFriend.userName,
        email: isUser ? rawFriend.friendEmail : rawFriend.userEmail,
        username: isUser ? rawFriend.friendUsername : rawFriend.userUsername,
        avatar: isUser ? rawFriend.friendAvatar : rawFriend.userAvatar,
        createdAt: isUser ? rawFriend.friendCreatedAt : rawFriend.userCreatedAt,
        lastMessage: rawFriend.lastMessageContent,
        lastMessageCreatedAt: rawFriend.lastMessageCreatedAt,
      };
    });

    return friends;
  }

  async getFriendIds(userId: string): Promise<string[]> {
    const friendships = await this.repository
      .createQueryBuilder("friendship")
      .where(
        "friendship.user_id = :userId AND friendship.status = 'accepted'",
        { userId }
      )
      .orWhere(
        "friendship.friend_id = :userId AND friendship.status = 'accepted'",
        { userId }
      )
      .select([
        "friendship.user_id AS userId",
        "friendship.friend_id AS friendId",
      ])
      .getRawMany();

    const friendIds = friendships.map((friendship) =>
      friendship.userId === userId ? friendship.friendId : friendship.userId
    );

    return friendIds;
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
