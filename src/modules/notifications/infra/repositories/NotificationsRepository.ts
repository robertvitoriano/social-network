import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { Notification } from "../typeorm/entities/Notification";
import { Repository, getRepository } from "typeorm";
import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";
import { INotification } from "@modules/notifications/useCases/listNotifications/interfaces";
import { NotificationTypes } from "@shared/enums/notification-types";

class NotificationsRepository implements INotificationsRepository {
  private repository: Repository<Notification>;

  constructor() {
    this.repository = getRepository(Notification);
  }
  async create(data: ICreateNotificationDTO): Promise<Notification> {
    const { notificationTypeId, senderId, receiverId } = data;
    const notificationToBeCreated = this.repository.create({
      notification_type_id: notificationTypeId,
      sender_id: senderId,
      receiver_id: receiverId,
    });

    const notification = await this.repository.save(notificationToBeCreated);

    return notification;
  }

  async listFriendshipNotificationsByUserId(
    userId: string
  ): Promise<INotification[]> {
    const userNotifications = await this.repository
      .createQueryBuilder("notification")
      .innerJoinAndSelect("notification.receiver", "receiver")
      .innerJoinAndSelect("notification.sender", "sender")
      .innerJoinAndSelect("notification.notificationType", "notificationType")
      .innerJoin(
        "friendship",
        "friendship",
        "notification.receiver_id = friendship.friend_id"
      )
      .where("receiver.id = :userId", { userId })
      .andWhere("notification.notificationType = :notificationType", {
        notificationType: NotificationTypes.FRIENDSHIP_REQUEST,
      })
      .select([
        "notification.id as id",
        "receiver.name as receiverName",
        "notificationType.type as type",
        "sender.id as senderId",
        "sender.name as senderName",
        "notification.created_at",
        "sender.avatar as senderAvatar",
        "friendship.status as friendshipRequestStatus",
      ])
      .getRawMany();

    return userNotifications;
  }
}
export { NotificationsRepository };
