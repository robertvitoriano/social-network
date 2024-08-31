import { Repository, SelectQueryBuilder, getRepository } from "typeorm";
import { Post } from "../entities/Post";
import { Comment } from "./../entities/Comment";
import { IFeedRepository } from "./IFeedRepository";
import { ICreatePostDTO } from "../../dtos/ICreatePostDTO";
import {
  IListUserPostsParams,
  IPost,
} from "../../useCases/listUserPosts/types";
import { Like } from "../entities/Like";
import { ICreateCommentDTO } from "../../dtos/ICreateCommentDTO";

class FeedRepository implements IFeedRepository {
  private postRepository: Repository<Post>;
  private likeRepository: Repository<Like>;
  private commentRepository: Repository<Comment>;
  constructor() {
    this.likeRepository = getRepository(Like);
    this.postRepository = getRepository(Post);
    this.commentRepository = getRepository(Comment);
  }

  async getPostsCount(userId: string): Promise<number> {
    const count = await this.postRepository
      .createQueryBuilder("posts")
      .where("posts.user_id = :userId", { userId })
      .getCount();

    return count;
  }
  async listUserTimelinePosts({
    userId,
    page,
    postsPerPage = 25,
  }: IListUserPostsParams): Promise<IPost[]> {
    const skip = page ? (page - 1) * postsPerPage : 0;

    const posts = await this.postRepository
      .createQueryBuilder("posts")
      .innerJoin("posts.user", "user")
      .leftJoinAndMapOne(
        "posts.lastComment",
        this.getLastCommentSubquery,
        "lastComment",
        "lastComment.lastCommentPostId = posts.id"
      )
      .select([
        "posts.id as id",
        "posts.user_id as userId",
        "posts.likes_count as likesCount",
        "user.avatar as userAvatar",
        "user.id as userId",
        "user.name as userName",
        "user.email as userEmail",
        "posts.content as content",
        "posts.comments_count as commentsCount",
        "posts.created_at as createdAt",
        "lastComment.lastCommentContent",
        "lastComment.lastCommentContent",
        "lastComment.lastCommentId",
        "lastComment.lastCommentCreatedAt",
        "lastComment.lastCommentPostId",
        "lastComment.lastCommentUserId",
        "lastComment.lastCommentUserName",
        "lastComment.lastCommentUserAvatar",
      ])
      .where("posts.timeline_owner_id = :userId", { userId })
      .orderBy("posts.created_at", "DESC")
      .skip(skip)
      .take(postsPerPage)
      .getRawMany();

    return posts.map(this.mapPost);
  }
  private mapPost(post: any): IPost {
    return {
      id: post.id,
      userId: post.user_id,
      content: post.content,
      createdAt: post.created_at,
      likesCount: post.likes_count,
      commentsCount: post.comments_count,
      lastComment: post.lastCommentId
        ? {
            id: post.lastCommentId,
            content: post.lastCommentContent,
            createdAt: post.lastCommentCreatedAt,
            user: {
              id: post.lastCommentUserId,
              name: post.lastCommentUserName,
              avatar: post.lastCommentUserAvatar,
            },
          }
        : null,
      creator: {
        id: post.user_id,
        name: post.userName,
        avatar: post.userAvatar,
        email: post.userEmail,
      },
    };
  }
  private getLastCommentSubquery = (qb: SelectQueryBuilder<Comment>) => {
    return qb
      .select("c.content", "lastCommentContent")
      .addSelect("c.id", "lastCommentId")
      .addSelect("c.created_at", "lastCommentCreatedAt")
      .addSelect("c.post_id", "lastCommentPostId")
      .addSelect("commentUser.id", "lastCommentUserId")
      .addSelect("commentUser.name", "lastCommentUserName")
      .addSelect("commentUser.avatar", "lastCommentUserAvatar")
      .from("comments", "c")
      .innerJoin("c.user", "commentUser")
      .where(
        `c.created_at = (
                SELECT MAX(c2.created_at)
                FROM comments c2
                WHERE c2.post_id = c.post_id
              )`
      );
  };

  async createPost(data: ICreatePostDTO): Promise<void> {
    const createdPost = this.postRepository.create({
      user_id: data.userId,
      content: data.content,
      timeline_owner_id: data.timelinedOwnerId,
    });
    await this.postRepository.save(createdPost);
  }
  async removeLike(postId: string, like: Like) {
    await this.likeRepository.remove(like);
    await this.postRepository.decrement({ id: postId }, "likes_count", 1);
  }
  async findLike(postId: string, userId: string) {
    const like = await this.likeRepository.findOne({
      where: { post_id: postId, user_id: userId },
    });
    return like;
  }

  async createLike(postId: string, userId: string) {
    const newLike = this.likeRepository.create({
      post_id: postId,
      user_id: userId,
    });
    await this.likeRepository.save(newLike);
    await this.postRepository.increment({ id: postId }, "likes_count", 1);
  }

  async createComment(data: ICreateCommentDTO) {
    const { postId, userId, content } = data;
    const newComment = this.commentRepository.create({
      post_id: postId,
      user_id: userId,
      content: content,
    });
    await this.commentRepository.save(newComment);
    await this.postRepository.increment({ id: postId }, "comments_count", 1);
  }
  async removeComment(postId: string, comment: Comment) {
    await this.commentRepository.remove(comment);
    await this.postRepository.decrement({ id: postId }, "comments_count", 1);
  }
  async listComments(data: {
    postId: string;
    page: number;
    commentsPerPage: number;
  }): Promise<any> {
    const { postId, page, commentsPerPage } = data;
    const skip = page ? (page - 1) * commentsPerPage : 0;

    const comments = await this.commentRepository
      .createQueryBuilder("comments")
      .innerJoin("comments.user", "user")
      .addSelect(["user.id", "user.name", "user.email", "user.avatar"])
      .where("comments.post_id = :postId", { postId })
      .orderBy("comments.created_at", "DESC")
      .skip(skip)
      .take(commentsPerPage)
      .getMany();

    return comments;
  }

  async getCommentsCount(postId: string): Promise<number> {
    const count = await this.commentRepository
      .createQueryBuilder("comments")
      .where("comments.post_id = :postId", { postId })
      .getCount();

    return count;
  }
}

export { FeedRepository };
