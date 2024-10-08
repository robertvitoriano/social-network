import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../IUsersRepository";

class InMemoryUsersRepository {
  users: User[] = [];

  async create({ email, name, password }: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, {
      email,
      name,
      password,
    });
    this.users.push(user);
    return user;
  }
  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);
    return user;
  }
  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => (user.id = id));
    return user;
  }
}

export { InMemoryUsersRepository };
