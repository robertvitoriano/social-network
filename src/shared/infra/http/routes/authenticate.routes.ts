import { Router } from "express";
import { AuthenticateUserController } from "../../../../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { LogOutUserController } from "../../../../modules/accounts/useCases/logoutUser/LogOutUserController";
import { PassportService } from "@modules/accounts/useCases/LoginOAuthUseCase/PassportService";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const authenticateRoutes = Router();

const authenticateController = new AuthenticateUserController();
const logoutUserController = new LogOutUserController();

authenticateRoutes.post("/log-in", authenticateController.handle);
authenticateRoutes.post(
  "/log-out",
  ensureAuthenticated,
  logoutUserController.handle
);

const passportService = new PassportService();

function passportGoogleAuth() {
  passportService.setup();
  return passportService
    .getInstance()
    .authenticate("google", { scope: ["profile", "email"] });
}
function passportGoogleCallback() {
  passportService.setup();
  return passportService
    .getInstance()
    .authenticate("google", { failureRedirect: "/login" });
}
authenticateRoutes.get("/auth/google", passportGoogleAuth);

authenticateRoutes.get(
  "/auth/google/callback",
  passportGoogleCallback,
  function (req, res) {
    //@ts-ignore
    const { token } = res.req.user;

    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

export { authenticateRoutes };
