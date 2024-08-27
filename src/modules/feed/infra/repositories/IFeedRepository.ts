import { Post } from "../entities/Post";
import { ICreatePostDTO } from "./../../dtos/ICreatePostDTO";
export type UserUpdateFields = {
  username?: string;
  name?: string;
  email?: string;
  avatar?: string;
};
interface IFeedRepository {
  create(data: ICreatePostDTO): Promise<void>;
}

export { IFeedRepository };
