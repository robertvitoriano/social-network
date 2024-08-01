import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { LoginOAuthUseCase } from "./LoginOAuthUseCase";
import { container } from "tsyringe";

const loginOAuthUseCase = container.resolve(LoginOAuthUseCase);
passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async function (profile, cb) {
      const loginResponse = await loginOAuthUseCase.execute(profile);
      cb(null, loginResponse);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export { passport };
