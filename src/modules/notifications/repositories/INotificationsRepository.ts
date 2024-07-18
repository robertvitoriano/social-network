import ICreateNotificationDTO from "./../dtos/ICreateNotificationDTO";

interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<void>;
}

export { INotificationsRepository };
