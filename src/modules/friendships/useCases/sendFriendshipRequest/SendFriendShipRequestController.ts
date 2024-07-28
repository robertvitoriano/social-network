import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendFriendshipUseCase } from "./SendFrienshipRequestUseCase";
class SendFriendShipController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const sendFriendShipUseCase: SendFriendshipUseCase = container.resolve(
        SendFriendshipUseCase
      );

      const { friendId } = request.body;
      const { id, name } = request.user;
      await sendFriendShipUseCase.execute({
        friendId,
        userId: id,
        userName: name,
      });

      return response
        .status(201)
        .json({ message: "Friendship created with success" });
    } catch (err) {
      console.error(err);
      const errorCode = err.statusCode || 500;
      throw new AppError("Error creating user", errorCode);
    }
  }
}

export { SendFriendShipController };
