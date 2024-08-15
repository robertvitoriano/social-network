import { container } from "tsyringe";
import { UserRepository } from "./../../modules/accounts/infra/repositories/UsersRepository";
import { IUsersRepository } from "../../modules/accounts/repositories/IUsersRepository";
import { ChatRepository } from "../../modules/chat/infra/repositories/ChatRepository";
import { IChatRepository } from "../../modules/chat/repositories/IChatRepository";
import { FriendshipRepository } from "../../modules/friendships/infra/repositories/FriendshipRepository";
import { IFriendshipsRepository } from "../../modules/friendships/repositories/IFriendshipsRepository";
import { NotificationsRepository } from "../../modules/notifications/infra/repositories/NotificationsRepository";
import { INotificationsRepository } from "../../modules/notifications/repositories/INotificationsRepository";
import AWS from "aws-sdk";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UserRepository
);

container.registerSingleton<IFriendshipsRepository>(
  "FriendshipRepository",
  FriendshipRepository
);
container.registerSingleton<INotificationsRepository>(
  "NotificationRepository",
  NotificationsRepository
);
container.registerSingleton<AWS.S3>("S3", AWS.S3);
container.registerSingleton<IChatRepository>("ChatRepository", ChatRepository);
