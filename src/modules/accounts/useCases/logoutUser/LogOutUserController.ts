import { container } from "tsyringe";
import { Request, Response } from "express";
import { LogoutUserUseCase } from "./LogOutUserUseCase";

class LogOutUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id: userId } = request.user;

      const logoutUserUseCase = container.resolve(LogoutUserUseCase);
      logoutUserUseCase.execute(userId);
      return response.json({ message: "successfully logged out" });
    } catch (error) {
      console.error(error);
      return response.status(error.statusCode).json({
        message: error.message || "Unexpected error.",
      });
    }
  }
}

export { LogOutUserController };
