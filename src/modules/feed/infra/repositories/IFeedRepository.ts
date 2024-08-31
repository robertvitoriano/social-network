import { ICreateCommentDTO } from "../../dtos/ICreateCommentDTO";
import {
  IListUserPostsParams,
  IPost,
} from "../../useCases/listUserPosts/types";
import { PostLike } from "../entities/PostLike";
import { ICreatePostDTO } from "./../../dtos/ICreatePostDTO";
import { Comment } from "../entities/Comment";
import { IComment } from "../../useCases/listComments/types";
import { CommentLike } from "../entities/CommentLike";

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
  removePostLike(postId: string, PostLike: PostLike): Promise<void>;
  findPostLike(postId: string, userId: string): Promise<PostLike>;
  createCommentLike(commentId: string, userId: string): Promise<void>;
  removeCommentLike(commentId: string, commentLike: CommentLike): Promise<void>;
  findCommentLike(commentId: string, userId: string): Promise<CommentLike>;
  createPostLike(postId: string, userId: string): Promise<void>;
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
