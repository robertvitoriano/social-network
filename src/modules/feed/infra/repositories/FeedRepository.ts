import { Repository, SelectQueryBuilder, getRepository } from "typeorm";
import { Post } from "../entities/Post";
import { Comment } from "./../entities/Comment";
import { IFeedRepository } from "./IFeedRepository";
import { ICreatePostDTO } from "../../dtos/ICreatePostDTO";
import {
  IListUserPostsParams,
  IPost,
} from "../../useCases/listUserPosts/types";
import { PostLike } from "../entities/PostLike";
import { ICreateCommentDTO } from "../../dtos/ICreateCommentDTO";
import { CommentLike } from "../entities/CommentLike";

class FeedRepository implements IFeedRepository {
  private postRepository: Repository<Post>;
  private postLikeRepository: Repository<PostLike>;
  private commentRepository: Repository<Comment>;
  private commentLikeRepository: Repository<CommentLike>;

  constructor() {
    this.postLikeRepository = getRepository(PostLike);
    this.postRepository = getRepository(Post);
    this.commentLikeRepository = getRepository(CommentLike);
    this.commentRepository = getRepository(Comment);
  }

  async getPostsCount(userId: string): Promise<number> {
    const count = await this.postRepository
      .createQueryBuilder("posts")
      .where("posts.user_id = :userId", { userId })
      .getCount();

    return count;
  }

  async getPost(postId: string): Promise<IPost | null> {
    const post = await this.postRepository
      .createQueryBuilder("posts")
      .andWhere("posts.id = :postId", { postId })
      .innerJoinAndSelect("posts.user", "user")
      .leftJoinAndSelect("posts.comments", "comments")
      .leftJoinAndSelect("comments.user", "commentUser")
      .getOne();
    if (!post) return null;
    return {
      ...post,
      comments:
        post?.comments.map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          user: comment.user,
          postId: comment.post_id,
          createdAt: comment.created_at,
          likesCount: comment.likes_count,
        })) || [],
      createdAt: post.created_at,
      likesCount: post.likes_count,
      commentsCount: post.comments_count,
      lastComment: null,
    };
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
        "user.avatar as userAvatar",
        "user.id as userId",
        "user.name as userName",
        "user.email as userEmail",
        "posts.content as content",
        "posts.comments_count as commentsCount",
        "posts.created_at as createdAt",
        "posts.likes_count as likesCount",
        "lastComment.lastCommentContent",
        "lastComment.lastCommentContent",
        "lastComment.lastCommentId",
        "lastComment.lastCommentCreatedAt",
        "lastComment.lastCommentPostId",
        "lastComment.lastCommentUserId",
        "lastComment.lastCommentUserName",
        "lastComment.lastCommentUserAvatar",
        "lastComment.lastCommentLikesCount",
      ])
      .where("posts.timeline_owner_id = :userId", { userId })
      .orderBy("posts.created_at", "DESC")
      .skip(skip)
      .take(postsPerPage)
      .getRawMany();

    return posts.map(this.mapPost);
  }
  private mapPost(post: any): IPost {
    console.log({ post });
    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      lastComment: post.lastCommentId
        ? {
            id: post.lastCommentId,
            content: post.lastCommentContent,
            createdAt: post.lastCommentCreatedAt,
            likesCount: post.lastCommentLikesCount,
            user: {
              id: post.lastCommentUserId,
              name: post.lastCommentUserName,
              avatar: post.lastCommentUserAvatar,
            },
          }
        : null,
      comments: null,
      user: {
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
      .addSelect("c.likes_count", "lastCommentLikesCount")
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
  async removePostLike(postId: string, PostLike: PostLike) {
    await this.postLikeRepository.remove(PostLike);
    await this.postRepository.decrement({ id: postId }, "likes_count", 1);
  }
  async findPostLike(postId: string, userId: string) {
    const postLike = await this.postLikeRepository.findOne({
      where: { post_id: postId, user_id: userId },
    });
    return postLike;
  }

  async createPostLike(postId: string, userId: string) {
    const newPostLike = this.postLikeRepository.create({
      post_id: postId,
      user_id: userId,
    });
    await this.postLikeRepository.save(newPostLike);
    await this.postRepository.increment({ id: postId }, "likes_count", 1);
  }

  async createCommentLike(commentId: string, userId: string): Promise<void> {
    const newCommentLike = this.commentLikeRepository.create({
      comment_id: commentId,
      user_id: userId,
    });
    await this.commentLikeRepository.save(newCommentLike);
    await this.commentRepository.increment({ id: commentId }, "likes_count", 1);
  }
  async removeCommentLike(
    commentId: string,
    commentLike: CommentLike
  ): Promise<void> {
    await this.commentLikeRepository.remove(commentLike);
    await this.commentRepository.decrement({ id: commentId }, "likes_count", 1);
  }
  async findCommentLike(
    commentId: string,
    userId: string
  ): Promise<CommentLike> {
    const commentLike = await this.commentLikeRepository.findOne({
      where: { comment_id: commentId, user_id: userId },
    });
    return commentLike;
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
