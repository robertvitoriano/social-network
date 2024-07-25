import { container } from "tsyringe";
import { UserRepository } from "./../../modules/accounts/infra/repositories/UsersRepository";
import { IUsersRepository } from "../../modules/accounts/repositories/IUsersRepository";
import { FriendshipRepository } from "@modules/friendships/infra/repositories/FriendshipRepository";
import { IFriendshipsRepository } from "@modules/friendships/repositories/IFriendshipsRepository";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { NotificationsRepository } from "@modules/notifications/infra/repositories/NotificationsRepository";

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
