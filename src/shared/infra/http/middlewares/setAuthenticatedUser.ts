import { Response, Request, NextFunction } from "express";
import { UserRepository } from "../../../../modules/accounts/infra/repositories/UsersRepository";
import { verify } from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";

interface IPayload {
  sub: string;
}

export async function setAuthenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers?.authorization?.split(" ")[1];

  try {
    if (!token) return next();

    const { sub: userId } = verify(token, "secret") as IPayload;
    const usersRepository = new UserRepository();
    const user = await usersRepository.findById(userId);
    req.user = { id: userId, name: user.name, avatar: user.avatar };

    return next();
  } catch (error) {
    console.error(error);
    throw new AppError("Error on authentication", 401);
  }
}
