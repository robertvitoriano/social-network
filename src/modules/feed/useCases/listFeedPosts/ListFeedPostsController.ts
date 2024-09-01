import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListFeedPostsUseCase } from "./ListFeedPostsUseCase";
class ListFeedPostsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listFeedPostsUseCase: ListFeedPostsUseCase =
        container.resolve(ListFeedPostsUseCase);

      const { userId } = request.params;
      const { page } = request.query;
      const listFeedPostsResponse = await listFeedPostsUseCase.execute({
        userId,
        page: Number(page),
      });

      return response.status(200).json(listFeedPostsResponse);
    } catch (err) {
      console.error(err);
      throw new AppError("Error to list user posts", 500);
    }
  }
}

export { ListFeedPostsController };
