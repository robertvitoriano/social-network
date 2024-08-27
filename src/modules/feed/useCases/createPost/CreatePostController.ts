import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreatePostUseCase } from "./CreatePostUseCase";
import { ServerErrorHttpStatusCode } from "../../../../shared/enums/http-status-codes";
import { AppError } from "../../../../shared/errors/AppError";
class CreatePostController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const createPostUseCase: CreatePostUseCase =
        container.resolve(CreatePostUseCase);

      const { content, timelinedOwnerId } = request.body;
      const { id: userId } = request.user;
      await createPostUseCase.execute({
        content,
        userId,
        timelinedOwnerId,
      });

      return response.status(201).json({ post: "Post created with success" });
    } catch (err) {
      console.error(err);
      const errorCode =
        err.statusCode || ServerErrorHttpStatusCode.INTERNAL_SERVER_ERROR;
      throw new AppError("Error creating new post", errorCode);
    }
  }
}

export { CreatePostController };
