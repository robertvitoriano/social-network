import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { Notification } from "../typeorm/entities/Notification";
import { Repository, getRepository } from "typeorm";
import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";
import { INotification } from "@modules/notifications/useCases/listNotifications/interfaces";

class NotificationsRepository implements INotificationsRepository {
  private repository: Repository<Notification>;

  constructor() {
    this.repository = getRepository(Notification);
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
        "receiver.name as receiverName",
        "notificationType.type as notificationType",
        "sender.name as senderName",
        "notification.created_at",
      ])
      .getRawMany();

    return userNotifications;
  }
}

export { NotificationsRepository };
