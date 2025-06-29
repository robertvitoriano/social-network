import { AppError } from "src/shared/errors/AppError";
import { Redis } from "./../../redis";
import { NextFunction, Request, Response } from "express";

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
  window: number = 60,
  limit: number = 4,
  blockDuration: number = 120
) {
  const redisClient = Redis.getClient()
  const isClientBlocked = await redisClient.exists(`${req.ip}:blocked`);
  
  if (isClientBlocked) {
    throw new AppError("Client ip is blocked", 429);
  }
  
  const incr = await redisClient.incr(req.ip);

  if (incr === 1) {
    await redisClient.expire(req.ip, window);
  }

  if (incr > limit) {
    await redisClient.set(`${req.ip}:blocked`, "blocked");
    await redisClient.expire(`${req.ip}:blocked`, blockDuration);
    throw new AppError("Too many requests. Client ip will be blocked for 2 minutes", 429);
  }

  return next();
}
