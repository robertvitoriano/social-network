import { inject, injectable } from "tsyringe";
import { INotification } from "./interfaces";
import { INotificationsRepository } from "../../repositories/INotificationsRepository";

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
