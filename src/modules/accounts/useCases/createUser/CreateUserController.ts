import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateUserUseCase } from "./CreateUserUseCase";
class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const createUserUseCase = container.resolve(CreateUserUseCase);

      const { name, email, password, isAdmin } = request.body;

      await createUserUseCase.execute({
        name,
        email,
        password,
        isAdmin,
      });

      return response
        .status(201)
        .json({ message: "User created with success" });
    } catch (err) {
      console.error(err);
      throw new AppError("Error creating user", 500);
    }
  }
}

export { CreateUserController };
