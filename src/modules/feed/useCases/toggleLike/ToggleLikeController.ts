import { Request, Response } from "express";
import { container } from "tsyringe";
import { ToggleLikeUseCase } from "./ToggleLikeUseCase";
import { ServerErrorHttpStatusCode } from "../../../../shared/enums/http-status-codes";
import { AppError } from "../../../../shared/errors/AppError";
class ToggleLikeController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const toggleLikeUseCase: ToggleLikeUseCase =
        container.resolve(ToggleLikeUseCase);

      const { postId } = request.body;
      const { id: userId } = request.user;
      await toggleLikeUseCase.execute(postId, userId);

      return response.status(201).json({ post: "like toggled" });
    } catch (err) {
      console.error(err);
      const errorCode =
        err.statusCode || ServerErrorHttpStatusCode.INTERNAL_SERVER_ERROR;
      throw new AppError("Error toggling like", errorCode);
    }
  }
}

export { ToggleLikeController };
