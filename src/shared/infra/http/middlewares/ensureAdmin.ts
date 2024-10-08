import { UserRepository } from "../../../../modules/accounts/infra/repositories/UsersRepository";
import { AppError } from "../../../errors/AppError";
import { NextFunction, Request, Response } from "express";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id } = request.user;
  const usersRepository = new UserRepository();
  const user = await usersRepository.findById(id);
  if (!user.isAdmin) throw new AppError("User is not an admin", 401);
  return next()
}