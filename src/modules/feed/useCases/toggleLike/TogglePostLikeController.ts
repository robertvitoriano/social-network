import { Request, Response } from "express";
import { container } from "tsyringe";
import { TogglePostLikeUseCase } from "./TogglePostLikeUseCase";
import { ServerErrorHttpStatusCode } from "../../../../shared/enums/http-status-codes";
import { AppError } from "../../../../shared/errors/AppError";
import { ToggleCommentLikeUseCase } from "./ToggleCommentLikeUseCase";
class ToggleLikeController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const togglePostLikeUseCase: TogglePostLikeUseCase = container.resolve(
        TogglePostLikeUseCase
      );
      const toggleCommentLikeUseCase: ToggleCommentLikeUseCase =
        container.resolve(ToggleCommentLikeUseCase);

      const { postId, commentId } = request.body;
      const { id: userId } = request.user;
      if (postId) {
        await togglePostLikeUseCase.execute(postId, userId);
        return response.status(201).json({ result: "post like toggled" });
      }
      if (commentId) {
        await toggleCommentLikeUseCase.execute(commentId, userId);
        return response.status(201).json({ result: "comment like toggled" });
      }
    } catch (err) {
      console.error(err);
      const errorCode =
        err.statusCode || ServerErrorHttpStatusCode.INTERNAL_SERVER_ERROR;
      throw new AppError("Error toggling like", errorCode);
    }
  }
}

export { ToggleLikeController };
