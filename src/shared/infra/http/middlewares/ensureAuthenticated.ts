import { Response, Request, NextFunction } from "express";
import { UserRepository } from "../../../../modules/accounts/infra/repositories/UsersRepository";
import { verify } from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.headers.authorization) throw new AppError("token is missing", 401);

  const token = req.headers.authorization.split(" ")[1];

  try {
    const { sub: userId } = verify(token, "secret") as IPayload;

    if (!userId) throw new AppError("token is invalid", 401);

    const usersRepository = new UserRepository();

    const user = await usersRepository.findById(userId);

    if (!user) throw new AppError("User not found", 401);

    req.user = { id: userId, name: user.name };

    next();
  } catch {
    throw new AppError("Invalid Token", 401);
  }
}
