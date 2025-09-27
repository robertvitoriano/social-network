import { container } from "tsyringe";
import { Request, Response } from "express";
import { ListUsersUseCase } from "./ListUsersUseCase";
export class GetUserProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listUsersUseCase = container.resolve(ListUsersUseCase);

      const users = await listUsersUseCase.execute();
      return response.json({data: users});
    } catch (error) {
      console.error(error);
      return response.status(error.statusCode).json({
        message: error.message || "Unexpected error.",
      });
    }
  }
}
