import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Notification } from "../typeorm/entities/Notification";
import { Repository, getRepository } from "typeorm";
import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";

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
}

export { NotificationsRepository };
