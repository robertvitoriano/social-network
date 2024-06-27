import ICreateUserDTO from "@modules/accounts/dtos/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "../IFriendshipsRepository";

class InMemoryUsersRepository implements IUsersRepository {
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
