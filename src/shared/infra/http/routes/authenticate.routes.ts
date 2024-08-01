import { Router } from "express";
import { AuthenticateUserController } from "../../../../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { passport } from "@modules/accounts/useCases/LoginOAuthUseCase/passport-setup";

const authenticateRoutes = Router();

const authenticateController = new AuthenticateUserController();

authenticateRoutes.post("/sessions", authenticateController.handle);

authenticateRoutes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authenticateRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    //@ts-ignore
    const { token } = res.req.user;

    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

export { authenticateRoutes };
