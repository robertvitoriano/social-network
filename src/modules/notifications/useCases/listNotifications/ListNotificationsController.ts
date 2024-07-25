import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListNotificationsUseCase } from "./ListNotificationsUseCase";
class ListUserNotificationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listUserNotificationsUseCase: ListNotificationsUseCase =
        container.resolve(ListNotificationsUseCase);

      const { id } = request.user;
      const userNotifications = await listUserNotificationsUseCase.execute(id);

      return response.status(200).json({
        userNotifications,
      });
    } catch (err) {
      console.error(err);
      throw new AppError("Error to list Notifications", 500);
    }
  }
}

export { ListUserNotificationsController };
