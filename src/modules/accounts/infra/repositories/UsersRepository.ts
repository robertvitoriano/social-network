import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import { User } from "../../infra/typeorm/entities/User";
import { Repository, getRepository } from "typeorm";
import {
  IUsersRepository,
  UserUpdateFields,
} from "../../repositories/IUsersRepository";
import { getValidProperties } from "../../../../utils/parsing";

class UserRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }
  async findByUsername(username: string): Promise<User> {
    const user = await this.repository.findOne({ where: { username } });
    return user;
  }

  async updateUser(
    userId: string,
    fields: UserUpdateFields
  ): Promise<User | null> {
    const updateData: Partial<UserUpdateFields> = getValidProperties(fields);

    if (Object.keys(updateData).length > 0) {
      await this.repository.update(userId, updateData);

      const updatedUser = await this.repository.findOne({
        where: { id: userId },
        select: ["id", "name", "email", "username", "avatar", "cover"],
      });
      return updatedUser || null;
    }

    return null;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ where: { email } });
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { id },
      select: ["id", "name", "email", "username", "avatar", "cover"],
    });
    return user;
  }

  async updateOnlineStatus(userId: string, online: boolean): Promise<void> {
    await this.repository.update(userId, { online });
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
  async isUserOnline(userId: string): Promise<boolean> {
    const user = await this.repository.findOne({
      where: { id: userId },
      select: ["online"],
    });
    return !!user?.online;
  }
}

export { UserRepository };
