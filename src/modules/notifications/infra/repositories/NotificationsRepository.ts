import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Notification } from "../typeorm/entities/Notification";
import { Repository, getRepository } from "typeorm";
import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";
import { INotification } from "@modules/notifications/useCases/listNotifications/interfaces";

class NotificationsRepository implements INotificationsRepository {
  private repository: Repository<Notification>;
  private userRepository: Repository<User>;

  constructor() {
    this.repository = getRepository(Notification);
    this.userRepository = getRepository(User);
  }
  async create(data: ICreateNotificationDTO): Promise<void> {
    const { notificationTypeId, senderId, receiverId } = data;
    const notification = this.repository.create({
      notification_type_id: notificationTypeId,
      sender_id: senderId,
      receiver_id: receiverId,
    });

    await this.repository.save(notification);
  }

  async listNotificationsByUserId(userId: string): Promise<INotification[]> {
    const userNotifications = await this.repository
      .createQueryBuilder("notification")
      .innerJoinAndSelect("notification.receiver", "receiver")
      .innerJoinAndSelect("notification.sender", "sender")
      .innerJoinAndSelect("notification.notificationType", "notificationType")
      .where("receiver.id = :userId", { userId })
      .select([
        "notification.id",
        "receiver.name",
        "notificationType.type",
        "sender.name",
        "notification.created_at",
      ])
      .getRawMany();

    console.log({ userNotifications });

    return userNotifications;
  }
}

export { NotificationsRepository };
