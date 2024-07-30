import { INotification } from "../useCases/listNotifications/interfaces";
import ICreateNotificationDTO from "./../dtos/ICreateNotificationDTO";
import { Notification } from "../infra/typeorm/entities/Notification";
interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
  listFriendshipNotificationsByUserId(userId: string): Promise<INotification[]>;
  readNotifications(unreadNotificationIds: string[]): Promise<void>;
}

export { INotificationsRepository };
