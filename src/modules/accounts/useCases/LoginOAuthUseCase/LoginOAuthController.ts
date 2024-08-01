import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoginOAuthUseCase } from "./LoginOAuthUseCase";

class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email, accessToken } = request.body;

      const loginOAuthUseCase = container.resolve(LoginOAuthUseCase);

      const authenticateInfo = await loginOAuthUseCase.execute({
        email,
        accessToken,
      });

      return response.json(authenticateInfo);
    } catch (error) {
      console.error(error);
      return response.status(error.statusCode).json({
        message: error.message || "Unexpected error.",
      });
    }
  }
}

export { AuthenticateUserController };
