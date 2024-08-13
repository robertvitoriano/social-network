import { Router } from "express";
import { AuthenticateUserController } from "../../../../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { LogOutUserController } from "../../../../modules/accounts/useCases/logoutUser/LogOutUserController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();
const authenticateRoutes = Router();

const authenticateController = new AuthenticateUserController();
const logoutUserController = new LogOutUserController();

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log("HELLO WORLD");
    }
  )
);

authenticateRoutes.post("/log-in", authenticateController.handle);
authenticateRoutes.post(
  "/log-out",
  ensureAuthenticated,
  logoutUserController.handle
);

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
