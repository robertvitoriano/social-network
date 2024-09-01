import { inject, injectable } from "tsyringe";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { uploadFile } from "src/utils/upload-file";

interface IRequest {
  user_id: string;
  updateData: {
    name?: string;
    email?: string;
    username?: string;
    avatarFile?: Express.Multer.File;
    coverFile?: Express.Multer.File;
  };
}

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ user_id, updateData }: IRequest): Promise<User> {
    const { avatarFile, coverFile, name, username, email } = updateData;
    const user = await this.usersRepository.findById(user_id);
    let avatarUrl = null;
    let coverUrl = null;

    if (!user) {
      throw new Error("User not found");
    }
    if (avatarFile) {
      avatarUrl = await uploadFile({
        file: avatarFile,
        bucketPath: "user-avatar",
      });
    }
    if (coverFile) {
      coverUrl = await uploadFile({
        file: coverFile,
        bucketPath: "cover-avatar",
      });
    }
    const updateResult = await this.usersRepository.updateUser(user_id, {
      avatar: avatarUrl,
      email,
      username,
      name,
      cover: coverUrl,
    });
    return updateResult;
  }
}

export { UpdateUserUseCase };
