import { NotificationTypes } from "../../../../shared/enums/notification-types";
import ICreateNotificationDTO from "../../dtos/ICreateNotificationDTO";
import { INotificationsRepository } from "../../repositories/INotificationsRepository";
import { INotification } from "../../useCases/listNotifications/interfaces";
import { Notification } from "../typeorm/entities/Notification";
import { In, Repository, getRepository } from "typeorm";

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
  async readNotifications(unreadNotificationIds: string[]): Promise<void> {
    await this.repository.update(
      { id: In(unreadNotificationIds) },
      { read: true }
    );
  }

  async listFriendshipNotificationsByUserId(
    userId: string
  ): Promise<INotification[]> {
    const userNotifications = await this.repository
      .createQueryBuilder("notification")
      .innerJoinAndSelect("notification.receiver", "receiver")
      .innerJoinAndSelect("notification.sender", "sender")
      .innerJoinAndSelect("notification.notificationType", "notificationType")
      .leftJoin(
        "friendship",
        "friendship",
        "notification.id = friendship.request_notification_id OR notification.id = friendship.accepted_notification_id"
      )
      .leftJoin(
        "messages",
        "messages",
        "notification.id = messages.notification_id"
      )
      .where("receiver.id = :userId", { userId })
      .andWhere("sender.id != :userId", { userId })
      .andWhere("notification.notificationType IN (:...notificationTypes)", {
        notificationTypes: [
          NotificationTypes.FRIENDSHIP_REQUEST,
          NotificationTypes.FRIENDSHIP_ACCEPTED,
          NotificationTypes.MESSAGE_RECEIVED,
        ],
      })
      .select([
        "notification.id as id",
        "receiver.name as receiverName",
        "notificationType.id as typeId",
        "notification.read as wasRead",
        "sender.id as senderId",
        "sender.name as senderName",
        "notification.created_at as createdAt",
        "sender.avatar as senderAvatar",
        "friendship.status as friendshipRequestStatus",
        "messages.content as content",
      ])
      .getRawMany();

    return userNotifications;
  }
}

export { NotificationsRepository };
