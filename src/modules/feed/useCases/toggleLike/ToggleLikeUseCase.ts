import { inject, injectable } from "tsyringe";
import { IFeedRepository } from "../../infra/repositories/IFeedRepository";

@injectable()
export class ToggleLikeUseCase {
  constructor(
    @inject("FeedRepository")
    private feedRepository: IFeedRepository
  ) {}

  async execute(postId: string, userId: string): Promise<void> {
    const existingLike = await this.feedRepository.findLike(postId, userId);

    if (existingLike) {
      await this.feedRepository.removeLike(postId, existingLike);
    } else {
      await this.feedRepository.createLike(postId, userId);
    }
  }
}
