import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { LoginOAuthUseCase } from "./LoginOAuthUseCase";
import { UserRepository } from "@modules/accounts/infra/repositories/UsersRepository";
export class PassportService {
  private usersRepository;
  private loginOAuthUseCase;
  private passportInstance;
  constructor() {
    this.passportInstance = passport;
  }
  setup() {
    this.usersRepository = new UserRepository();
    this.loginOAuthUseCase = new LoginOAuthUseCase(this.usersRepository);
    this.passportInstance.use(
      new Strategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
          scope: ["profile", "email"],
        },
        async function (profile, cb) {
          const loginResponse = await this.loginOAuthUseCase.execute(profile);
          cb(null, loginResponse);
        }
      )
    );

    this.passportInstance.serializeUser((user, done) => {
      done(null, user);
    });

    this.passportInstance.deserializeUser((user, done) => {
      done(null, user);
    });
  }
  getInstance() {
    return this.passportInstance;
  }
}
