import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ReadNotificationsUseCase } from "./ReadNotificationsUseCase";
class ReadNotificationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const readNotificationsUseCase: ReadNotificationsUseCase =
        container.resolve(ReadNotificationsUseCase);

      const { unreadNotificationIds } = request.body;
      const userNotifications = await readNotificationsUseCase.execute(
        unreadNotificationIds
      );

      return response.status(200).json({
        userNotifications,
      });
    } catch (err) {
      console.error(err);
      throw new AppError("Error to read notifications", 500);
    }
  }
}

export { ReadNotificationsController };
