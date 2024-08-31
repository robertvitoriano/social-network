import { inject, injectable } from "tsyringe";
import { IFeedRepository } from "../../infra/repositories/IFeedRepository";
import { IPost } from "../listUserPosts/types";

@injectable()
export class GetPostUseCase {
  constructor(
    @inject("FeedRepository")
    private feedRepository: IFeedRepository
  ) {}

  async execute(postId: string): Promise<IPost> {
    const post: IPost = await this.feedRepository.getPost(postId);
    return post;
  }
}
