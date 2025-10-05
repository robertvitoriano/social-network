import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { User } from "../../infra/typeorm/entities/User";
@injectable()
export class ListUsersUseCase {
  constructor(
    @inject("UsersRepository") 
    private usersRepository: IUsersRepository
  ) {}
  async execute():Promise<User[]> {
    
    const users = await this.usersRepository.list()
    
    return users;
    
  }
}
