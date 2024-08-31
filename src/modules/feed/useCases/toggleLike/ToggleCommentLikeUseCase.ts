import { inject, injectable } from "tsyringe";
import { IFeedRepository } from "../../infra/repositories/IFeedRepository";

@injectable()
export class ToggleCommentLikeUseCase {
  constructor(
    @inject("FeedRepository")
    private feedRepository: IFeedRepository
  ) {}

  async execute(commentId: string, userId: string): Promise<void> {
    const existingLike = await this.feedRepository.findCommentLike(
      commentId,
      userId
    );

    if (existingLike) {
      await this.feedRepository.removeCommentLike(commentId, existingLike);
    } else {
      await this.feedRepository.createCommentLike(commentId, userId);
    }
  }
}
