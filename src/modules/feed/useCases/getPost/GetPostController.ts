import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetPostUseCase } from "./GetPostUseCase";
class GetPostController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      console.log("trying to fetch post");
      const getPostUseCase: GetPostUseCase = container.resolve(GetPostUseCase);

      const { postId } = request.params;

      const getFeedPostResponse = await getPostUseCase.execute(postId);
      if (!getFeedPostResponse) {
        return response.status(404).json(getFeedPostResponse);
      }
      return response.status(200).json(getFeedPostResponse);
    } catch (err) {
      console.error(err);
      throw new AppError("Error to get user post ", 500);
    }
  }
}

export { GetPostController };
