import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListChatMessagesUseCase } from "./ListChatMessagesUseCase";
class ListChatMessagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listChatMessagesUseCase: ListChatMessagesUseCase =
        container.resolve(ListChatMessagesUseCase);

      const { id: userId } = request.user;
      const { friendId } = request.params;
      const userMessages = await listChatMessagesUseCase.execute({
        userId,
        friendId,
      });

      return response.status(200).json({
        userMessages,
      });
    } catch (err) {
      console.error(err);
      throw new AppError("Error to list friends", 500);
    }
  }
}

export { ListChatMessagesController };
