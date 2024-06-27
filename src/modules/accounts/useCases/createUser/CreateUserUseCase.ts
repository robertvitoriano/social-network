import { AppError } from "../../../../shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { hash } from "bcrypt";
@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private userRepository: IUsersRepository
  ) {}

  async execute({
    name,
    email,
    password,
    isAdmin,
  }: ICreateUserDTO): Promise<void> {
    const hashedPassword = await hash(password, 8);

    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) throw new AppError("User already exists", 400);

    await this.userRepository.create({
      name,
      email,
      isAdmin,
      password: hashedPassword,
    });
  }
}
export { CreateUserUseCase };
