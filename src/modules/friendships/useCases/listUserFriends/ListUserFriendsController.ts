import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListUserFriendsUseCase } from "./ListUserFriendsUseCase";
class ListUserFriendsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listUserFriendsUseCase: ListUserFriendsUseCase = container.resolve(
        ListUserFriendsUseCase
      );

      const { id } = request.user;
      const userFriends = await listUserFriendsUseCase.execute(id);

      return response.status(200).json({
        userFriends,
      });
    } catch (err) {
      console.error(err);
      throw new AppError("Error to list friends", 500);
    }
  }
}

export { ListUserFriendsController };
