import { AppError } from "./../../../../shared/errors/AppError";
import ICreateUserDTO from "@modules/accounts/dtos/ICreateUserDTO";
import { InMemoryUsersRepository } from "@modules/accounts/repositories/in-memory/inMemoryUserRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

// describe("Authenticate User", () => {
//   beforeEach(() => {
//     inMemoryUsersRepository = new InMemoryUsersRepository();
//     authenticateUserUseCase = new AuthenticateUserUseCase(
//       inMemoryUsersRepository
//     );
//     createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
//   });
//   it("Should be possible to authenticate user", async () => {
//     const user: ICreateUserDTO = {
//       email: "user@test.com",
//       password: "1234",
//       name: "User test",
//     };

//     await createUserUseCase.execute(user);
//     const result = await authenticateUserUseCase.execute({
//       email: user.email,
//       password: user.password,
//     });

//     expect(result).toHaveProperty("token");
//     expect(result.user.name).toBe(user.name);
//     expect(result.user.email).toBe(user.email);
//   });

//   it("Should not be able to authenticate a nonexistant user", () => {
//     expect(async () => {
//       await authenticateUserUseCase.execute({
//         email: "false@email.com",
//         password: "123456",
//       });
//     }).rejects.toBeInstanceOf(AppError);
//   });

//   it("Should not be able to authenticate user with incorrect password", () => {
//     expect(async () => {
//       const user: ICreateUserDTO = {
//         email: "user_incorrect_password@test.com",
//         password: "1234",
//         name: "User test password",
//       };
//       await createUserUseCase.execute(user);
//       await authenticateUserUseCase.execute({
//         email: user.email,
//         password: "123456",
//       });
//     }).rejects.toBeInstanceOf(AppError);
//   });
// });
