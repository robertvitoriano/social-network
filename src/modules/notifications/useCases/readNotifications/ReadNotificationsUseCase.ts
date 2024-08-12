import { inject, injectable } from "tsyringe";
import { INotificationsRepository } from "../../repositories/INotificationsRepository";

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
