import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCommentsUseCase } from "./ListCommentsUseCase";
class ListCommentController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listCommentsUseCase: ListCommentsUseCase =
        container.resolve(ListCommentsUseCase);

      const { postId } = request.params;
      const { page } = request.query;
      const listCommentsResponse = await listCommentsUseCase.execute({
        postId,
        page: Number(page),
      });

      return response.status(200).json(listCommentsResponse);
    } catch (err) {
      console.error(err);
      throw new AppError("Error to list user posts", 500);
    }
  }
}

export { ListCommentController };
