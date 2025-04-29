import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetTimelineUseCase } from "./GetTimelineUseCase";
class GetTimelineController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const getTimelineUseCase: GetTimelineUseCase =
        container.resolve(GetTimelineUseCase);

      const { postId } = request.params;

      const getFeedPostResponse = await getTimelineUseCase.execute(postId);
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

export { GetTimelineController };
