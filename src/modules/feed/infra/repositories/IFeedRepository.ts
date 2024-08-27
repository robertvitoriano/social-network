import {
  IListUserPostsParams,
  IPost,
} from "../../useCases/listUserPosts/types";
import { ICreatePostDTO } from "./../../dtos/ICreatePostDTO";
export type UserUpdateFields = {
  username?: string;
  name?: string;
  email?: string;
  avatar?: string;
};
interface IFeedRepository {
  createPost(data: ICreatePostDTO): Promise<void>;
  getPostsCount(userId: string): Promise<number>;
  listUserTimelinePosts(data: IListUserPostsParams): Promise<IPost[]>;
}

export { IFeedRepository };
