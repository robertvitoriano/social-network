import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoginOAuthUseCase } from "./LoginOAuthUseCase";
import { UserRepository } from "../../infra/repositories/UsersRepository";

class LoginOAuthController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email, accessToken } = request.body;
      const usersRepository = new UserRepository();
      const loginOAuthUseCase = new LoginOAuthUseCase(usersRepository);

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

export { LoginOAuthController };
