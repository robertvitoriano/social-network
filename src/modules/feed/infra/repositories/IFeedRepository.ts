import {
  IListUserPostsParams,
  IPost,
} from "../../useCases/listUserPosts/types";
import { Like } from "../entities/Like";
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
  removeLike(postId: string, like: Like): Promise<void>;
  findLike(postId: string, userId: string): Promise<Like>;
  createLike(postId: string, userId: string): Promise<void>;
}

export { IFeedRepository };
