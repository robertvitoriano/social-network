import { Repository, getRepository } from "typeorm";
import { Post } from "../entities/Post";
import { IFeedRepository } from "./IFeedRepository";
import { ICreatePostDTO } from "../../dtos/ICreatePostDTO";
import {
  IListUserPostsParams,
  IPost,
} from "../../useCases/listUserPosts/types";

class FeedRepository implements IFeedRepository {
  private postRepository: Repository<Post>;

  constructor() {
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
      .select([
        "posts.id as id",
        "posts.user_id as userId",
        "posts.content as content",
        "posts.created_at as createdAt",
      ])
      .where("posts.timeline_owner_id = :userId", { userId })
      .orderBy("posts.created_at", "DESC")
      .skip(skip)
      .take(postsPerPage)
      .getRawMany();

    return posts;
  }
  async createPost(data: ICreatePostDTO): Promise<void> {
    const createdPost = this.postRepository.create({
      user_id: data.userId,
      content: data.content,
      timeline_owner_id: data.timelinedOwnerId,
    });
    await this.postRepository.save(createdPost);
  }
}

export { FeedRepository };
