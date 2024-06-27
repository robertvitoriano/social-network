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
      const { id } = request.user;
      await sendFriendShipUseCase.execute({ friendId, userId: id });

      return response.status(201).json({ message: "User Sendd with success" });
    } catch (err) {
      console.error(err);
      throw new AppError("Error creating user", 500);
    }
  }
}

export { SendFriendShipController };
