import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import { User } from "../../infra/typeorm/entities/User";
import { Repository, getRepository } from "typeorm";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

class UserRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ where: { email } });
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne(id);
    return user;
  }

  async create({
    name,
    email,
    username,
    password,
    isAdmin = false,
    avatar,
    id,
  }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      name,
      email,
      username,
      password,
      isAdmin,
      avatar,
      id,
    });

    const userCreated = await this.repository.save(user);
    return userCreated;
  }
}

export { UserRepository };
