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
      const { id, avatar: userAvatar, name: userName } = request.user;
      await sendFriendShipResponseUseCase.execute({
        friendId,
        userId: id,
        status,
        userAvatar,
        userName,
      });

      return response.status(201).json({ message: "friendship updated" });
    } catch (err) {
      console.error(err);
      throw new AppError("error updating friendship", 500);
    }
  }
}

export { SendFriendShipResponseController };
