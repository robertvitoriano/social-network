import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoginOAuthUseCase } from "./LoginOAuthUseCase";
import { env } from "src/config/env";

class LoginOAuthController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const authCode = String(request.query.code);
      const loginOAuthUseCase = container.resolve(LoginOAuthUseCase);
      const { token, user } = await loginOAuthUseCase.execute(authCode);

      const frontendUrl = new URL(env.CLIENT_URL!);
      frontendUrl.searchParams.append("token", token);
      frontendUrl.searchParams.append("user", JSON.stringify(user));

      response.redirect(frontendUrl.toString());
    } catch (error) {
      console.error(error);
      return response.status(error.statusCode).json({
        message: error.message || "Unexpected error.",
      });
    }
  }
}

export { LoginOAuthController };
