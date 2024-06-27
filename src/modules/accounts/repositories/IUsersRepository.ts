import { User } from '../infra/typeorm/entities/User';
import ICreateUserDTO from "../dtos/ICreateUserDTO";

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User | undefined>;

}

export {IUsersRepository};
