import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendChatMessageUseCase } from "./SendChatMessageUseCase";
import { ServerErrorHttpStatusCode } from "../../../../shared/enums/http-status-codes";
class SendChatMessageController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const sendChatMessageUseCase: SendChatMessageUseCase = container.resolve(
        SendChatMessageUseCase
      );

      const { receiverId, content, friendshipId } = request.body;
      const { id, name, avatar } = request.user;
      await sendChatMessageUseCase.execute({
        receiverId,
        senderId: id,
        userName: name,
        userAvatar: avatar,
        content,
        friendshipId,
      });

      return response
        .status(201)
        .json({ message: "Message created with success" });
    } catch (err) {
      console.error(err);
      const errorCode =
        err.statusCode || ServerErrorHttpStatusCode.INTERNAL_SERVER_ERROR;
      throw new AppError("Error creating new message", errorCode);
    }
  }
}

export { SendChatMessageController };
