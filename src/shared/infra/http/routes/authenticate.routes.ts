import { Router } from "express";
import { AuthenticateUserController } from "../../../../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { LogOutUserController } from "../../../../modules/accounts/useCases/logoutUser/LogOutUserController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import dotenv from "dotenv";
import { LoginOAuthController } from "./../../../../modules/accounts/useCases/LoginOAuthUseCase/LoginOAuthController";
dotenv.config();
const authenticateRoutes = Router();

const authenticateController = new AuthenticateUserController();
const logoutUserController = new LogOutUserController();
const loginOAuthController = new LoginOAuthController();
authenticateRoutes.post("/log-in", authenticateController.handle);
authenticateRoutes.post(
  "/log-out",
  ensureAuthenticated,
  logoutUserController.handle
);

authenticateRoutes.get("/auth/google/callback", loginOAuthController.handle);

export { authenticateRoutes };
