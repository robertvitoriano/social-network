import { inject, injectable } from "tsyringe";
import { IFeedRepository } from "../../infra/repositories/IFeedRepository";

@injectable()
export class TogglePostLikeUseCase {
  constructor(
    @inject("FeedRepository")
    private feedRepository: IFeedRepository
  ) {}

  async execute(postId: string, userId: string): Promise<void> {
    const existingLike = await this.feedRepository.findPostLike(postId, userId);

    if (existingLike) {
      await this.feedRepository.removePostLike(postId, existingLike);
    } else {
      await this.feedRepository.createPostLike(postId, userId);
    }
  }
}
