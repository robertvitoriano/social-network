import { Router } from "express";
import { AuthenticateUserController } from "../../../../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { PassportService } from "@modules/accounts/useCases/LoginOAuthUseCase/PassportService";

const authenticateRoutes = Router();

const authenticateController = new AuthenticateUserController();

authenticateRoutes.post("/sessions", authenticateController.handle);

const passportService = new PassportService();

passportService.setup();

authenticateRoutes.get(
  "/auth/google",
  passportService
    .getInstance()
    .authenticate("google", { scope: ["profile", "email"] })
);

authenticateRoutes.get(
  "/auth/google/callback",
  passportService
    .getInstance()
    .authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    //@ts-ignore
    const { token } = res.req.user;

    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

export { authenticateRoutes };
