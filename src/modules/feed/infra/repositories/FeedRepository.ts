import { Repository, getRepository } from "typeorm";
import { Post } from "../entities/Post";
import { IFeedRepository } from "./IFeedRepository";
import { ICreatePostDTO } from "../../dtos/ICreatePostDTO";

class FeedRepository implements IFeedRepository {
  private postRepository: Repository<Post>;

  constructor() {
    this.postRepository = getRepository(Post);
  }
  async create(data: ICreatePostDTO): Promise<void> {
    const createdPost = this.postRepository.create({
      user_id: data.userId,
      content: data.content,
    });
    await this.postRepository.save(createdPost);
  }
}

export { FeedRepository };
