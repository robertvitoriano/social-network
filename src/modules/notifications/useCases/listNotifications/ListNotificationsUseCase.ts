import { inject, injectable } from "tsyringe";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { INotification } from "./interfaces";

@injectable()
class ListNotificationsUseCase {
  constructor(
    @inject("NotificationRepository")
    private notificationsRepository: INotificationsRepository
  ) {}

  async execute(userId: string): Promise<INotification[]> {
    const notifications =
      await this.notificationsRepository.listFriendshipNotificationsByUserId(
        userId
      );
    return notifications;
  }
}
export { ListNotificationsUseCase };
