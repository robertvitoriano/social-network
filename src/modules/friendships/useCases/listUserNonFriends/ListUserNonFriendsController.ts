import { AppError } from "../../../../shared/errors/AppError";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListUserNonFriendsUseCase } from "./ListUserNonFriendsUseCase";
class ListUserNonFriendsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listUserNonFriendsUseCase: ListUserNonFriendsUseCase =
        container.resolve(ListUserNonFriendsUseCase);

      const { id } = request.user;
      const nonFriends = await listUserNonFriendsUseCase.execute(id);

      return response.status(200).json({
        nonFriends,
      });
    } catch (err) {
      console.error(err);
      throw new AppError("Error to list non friends", 500);
    }
  }
}

export { ListUserNonFriendsController };
