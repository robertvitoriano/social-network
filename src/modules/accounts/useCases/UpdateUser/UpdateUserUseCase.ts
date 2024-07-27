import { inject, injectable } from "tsyringe";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { deleteFile } from "../../../../utils/file";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import crypto from "crypto";

interface IRequest {
  user_id: string;
  updateData: {
    name: string;
    email: string;
    username: string;
    avatarFile: Express.Multer.File;
  };
}

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ user_id, updateData }: IRequest): Promise<User> {
    const s3 = new AWS.S3();
    const { avatarFile } = updateData;
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new Error("User not found");
    }

    const filePath = path.resolve("./tmp/avatar", avatarFile.filename);
    const fileContent = fs.readFileSync(filePath);
    const fileHash = crypto.randomBytes(16).toString("hex");
    const fileKey = `user-avatar/${fileHash}-${avatarFile.originalname}`;

    await s3
      .upload({
        ACL: "public-read",
        ContentDisposition: "attachment",
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
        Body: fileContent,
        ContentType: updateData.avatarFile.mimetype,
      })
      .promise();

    this.usersRepository.updateUser(user_id, updateData);
    // user.avatar = uploadResult.Key;

    await deleteFile(filePath);

    return user;
  }
}

export { UpdateUserUseCase };
