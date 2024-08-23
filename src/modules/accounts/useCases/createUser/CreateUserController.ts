import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateUserUseCase } from "./CreateUserUseCase";
class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const createUserUseCase = container.resolve(CreateUserUseCase);

      const { name, username, email, password, isAdmin } = request.body;

      const createdUserData = await createUserUseCase.execute({
        name,
        username,
        email,
        password,
        isAdmin,
      });

      return response.status(201).json(createdUserData);
    } catch (err) {
      console.error(err);
      throw new AppError("Error creating user", err.statusCode);
    }
  }
}

export { CreateUserController };
