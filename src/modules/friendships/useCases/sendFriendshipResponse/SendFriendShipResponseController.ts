import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendFriendshipResponseUseCase } from "./SendFrienshipResponseUseCase";
class SendFriendShipResponseController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const sendFriendShipResponseUseCase: SendFriendshipResponseUseCase =
        container.resolve(SendFriendshipResponseUseCase);

      const { friendId, status } = request.body;
      const { id } = request.user;
      await sendFriendShipResponseUseCase.execute({
        friendId,
        userId: id,
        status,
      });

      return response.status(201).json({ message: "friendship updated" });
    } catch (err) {
      console.error(err);
      throw new AppError("Error creating user", 500);
    }
  }
}

export { SendFriendShipResponseController };
