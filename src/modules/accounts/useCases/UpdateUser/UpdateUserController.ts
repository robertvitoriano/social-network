import { Response, Request } from "express";
import { container } from "tsyringe";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

export class UpdateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const {
        user: { id },
        files,
        body: { name, email, username },
      } = request;
      const updateUserUseCase = container.resolve(UpdateUserUseCase);
      const { avatar, cover } = files as {
        avatar?: Express.Multer.File[];
        cover?: Express.Multer.File[];
      };

      const avatarFile = avatar ? avatar[0] : null;
      const coverFile = cover ? cover[0] : null;

      const user = await updateUserUseCase.execute({
        user_id: id,
        updateData: {
          name,
          email,
          username,
          avatarFile,
          coverFile,
        },
      });

      return response
        .status(200)
        .json({ message: "User  updated successfully", user });
    } catch (error) {
      console.error("Error updating user:", error);

      return response.status(500).json({
        message: "An error occurred while updating the user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
