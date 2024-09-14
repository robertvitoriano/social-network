import { container } from "tsyringe";
import { Request, Response } from "express";
import { GetUserProfileUseCase } from "./GetUserProfileUseCase";

export class GetUserProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { userId } = request.params;
      const getUserProfileUseCase = container.resolve(GetUserProfileUseCase);
      const profileResult = await getUserProfileUseCase.execute(
        userId,
        request.user.id
      );
      return response.json(profileResult);
    } catch (error) {
      console.error(error);
      return response.status(error.statusCode).json({
        message: error.message || "Unexpected error.",
      });
    }
  }
}
