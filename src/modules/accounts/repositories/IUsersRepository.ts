import { User } from "../infra/typeorm/entities/User";
import ICreateUserDTO from "../dtos/ICreateUserDTO";
export type UserUpdateFields = {
  username?: string;
  name?: string;
  email?: string;
  avatar?: string;
};
interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  updateUser(userId: string, fields: UserUpdateFields): Promise<User | null>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User | undefined>;
}

export { IUsersRepository };
