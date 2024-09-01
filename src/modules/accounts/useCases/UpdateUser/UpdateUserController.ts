import { Response, Request } from "express";
import { container } from "tsyringe";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

export class UpdateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const {
        user: { id },
        file,
        body: { name, email, username, fileBeingUploaded },
      } = request;
      const updateUserUseCase = container.resolve(UpdateUserUseCase);
      let avatarFile;
      let coverFile;
      if (fileBeingUploaded === "avatar") {
        avatarFile = file;
      }
      if (fileBeingUploaded === "cover") {
        coverFile = file;
      }
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
        message: "An error occurred while updating the user r",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
