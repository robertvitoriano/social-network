import { Repository, getRepository } from "typeorm";
import { Post } from "../entities/Post";
import { IFeedRepository } from "./IFeedRepository";
import { ICreatePostDTO } from "../../dtos/ICreatePostDTO";
import {
  IListUserPostsParams,
  IPost,
} from "../../useCases/listUserPosts/types";
import { Like } from "../entities/Like";

class FeedRepository implements IFeedRepository {
  private postRepository: Repository<Post>;
  private likeRepository: Repository<Like>;

  constructor() {
    this.likeRepository = getRepository(Like);
    this.postRepository = getRepository(Post);
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
      .select([
        "posts.id as id",
        "posts.user_id as userId",
        "posts.likes_count as likesCount",
        "user.avatar as userAvatar",
        "user.id as userId",
        "user.name as userName",
        "user.email as userEmail",
        "posts.content as content",
        "posts.created_at as createdAt",
      ])
      .where("posts.timeline_owner_id = :userId", { userId })
      .orderBy("posts.created_at", "DESC")
      .skip(skip)
      .take(postsPerPage)
      .getRawMany();

    return posts.map((post) => ({
      id: post.id,
      userId: post.userId,
      content: post.content,
      createdAt: post.createdAt,
      likesCount: post.likesCount,
      creator: {
        id: post.userId,
        name: post.userName,
        avatar: post.userAvatar,
        email: post.userEmail,
      },
    }));
  }

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
      where: { postId, userId },
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
}

export { FeedRepository };
