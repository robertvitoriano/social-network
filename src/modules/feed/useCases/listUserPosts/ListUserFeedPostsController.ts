import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListUserFeedPostsUseCase } from "./ListUserFeedPostsUseCase";
class ListUserFeedPostsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listUserFeedPostsUseCase: ListUserFeedPostsUseCase =
        container.resolve(ListUserFeedPostsUseCase);

      const { handle } = request.params;
      const { page } = request.query;
      const listUserFeedPostsResponse = await listUserFeedPostsUseCase.execute({
        handle,
        page: Number(page),
      });

      return response.status(200).json(listUserFeedPostsResponse);
    } catch (err) {
      console.error(err);
      throw new AppError("Error to list user posts", 500);
    }
  }
}

export { ListUserFeedPostsController };
