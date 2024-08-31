import { ICreateCommentDTO } from "../../dtos/ICreateCommentDTO";
import {
  IListUserPostsParams,
  IPost,
} from "../../useCases/listUserPosts/types";
import { Like } from "../entities/Like";
import { ICreatePostDTO } from "./../../dtos/ICreatePostDTO";
import { Comment } from "../entities/Comment";
import { IComment } from "../../useCases/listComments/types";

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
  createComment(data: ICreateCommentDTO);
  removeComment(postId: string, comment: Comment);
  listComments(data: {
    postId: string;
    page: number;
    commentsPerPage: number;
  }): Promise<IComment[]>;
  getCommentsCount(postId: string): Promise<number>;
  getPost(postId: string): Promise<IPost>;
}

export { IFeedRepository };
