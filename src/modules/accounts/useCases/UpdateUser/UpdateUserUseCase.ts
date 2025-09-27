import { inject, injectable } from "tsyringe";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { uploadFile } from "./../../../../utils/upload-file";

interface IRequest {
  user_id: string;
  updateData: {
    name?: string;
    email?: string;
    username?: string;
    avatarFile?: Express.Multer.File;
    coverFile?: Express.Multer.File;
    avatarUrl?: string;
  };
}

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ user_id, updateData }: IRequest): Promise<User> {
    const { avatarFile, coverFile, name, username, email,avatarUrl } = updateData;
    const user = await this.usersRepository.findById(user_id);
    let newAvatarUrl = avatarUrl;
    let coverUrl = null;

    if (!user) {
      throw new Error("User not found");
    }
    if (avatarFile) {
      newAvatarUrl = await uploadFile({
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
      avatar: newAvatarUrl,
      cover: coverUrl,
      email,
      username,
      name,
    });
    return updateResult;
  }
}

export { UpdateUserUseCase };
