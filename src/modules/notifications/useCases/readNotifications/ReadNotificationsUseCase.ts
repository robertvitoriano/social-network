import { inject, injectable } from "tsyringe";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";
import { INotification } from "./interfaces";

@injectable()
class ReadNotificationsUseCase {
  constructor(
    @inject("NotificationRepository")
    private notificationsRepository: INotificationsRepository
  ) {}

  async execute(unreadNotificationIds: string[]): Promise<void> {
    await this.notificationsRepository.readNotifications(unreadNotificationIds);
  }
}
export { ReadNotificationsUseCase };
