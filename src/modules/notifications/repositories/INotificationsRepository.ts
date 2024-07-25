import { INotification } from "../useCases/listNotifications/interfaces";
import ICreateNotificationDTO from "./../dtos/ICreateNotificationDTO";

interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<void>;
  listNotificationsByUserId(userId: string): Promise<INotification[]>;
}

export { INotificationsRepository };
