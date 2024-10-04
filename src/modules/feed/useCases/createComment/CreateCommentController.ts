import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCommentUseCase } from "./CreateCommentUseCase";
import { ServerErrorHttpStatusCode } from "../../../../shared/enums/http-status-codes";
import { AppError } from "../../../../shared/errors/AppError";
class CreateCommentController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const createCommentUseCase: CreateCommentUseCase =
        container.resolve(CreateCommentUseCase);

      const { content, postId, parentCommentId } = request.body;
      const { id: userId } = request.user;
      await createCommentUseCase.execute({
        content,
        userId,
        postId,
        parentCommentId,
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

export { CreateCommentController };
