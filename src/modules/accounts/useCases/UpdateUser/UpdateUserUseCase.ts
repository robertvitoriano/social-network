import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { inject, injectable } from "tsyringe";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { deleteFile } from "../../../../utils/file";

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
    const { avatarFile, name, username, email } = updateData;
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new Error("User not found");
    }

    const tmpDir = path.resolve(__dirname, "../../../../../tmp/avatar");

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const filePath = path.resolve(tmpDir, avatarFile.filename);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath);
    const fileHash = crypto.randomBytes(16).toString("hex");
    const fileKey = `user-avatar/${fileHash}-${avatarFile.originalname}`;

    const { Location } = await s3
      .upload({
        ACL: "public-read",
        ContentDisposition: "attachment",
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
        Body: fileContent,
        ContentType: updateData.avatarFile.mimetype,
      })
      .promise();

    const updateResult = await this.usersRepository.updateUser(user_id, {
      avatar: Location,
      email,
      username,
      name,
    });

    await deleteFile(filePath);
    console.log(updateResult);
    return updateResult;
  }
}

export { UpdateUserUseCase };
