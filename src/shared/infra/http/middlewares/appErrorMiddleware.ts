import { AppError } from "../../../errors/AppError";
import { NextFunction, Request, Response } from "express";

export const appErrorMiddleware = (
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    console.log({ err });
    response.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    return response.status(500).json({
      message: `Internal server error - ${err.message}`,
    });
  }
};
