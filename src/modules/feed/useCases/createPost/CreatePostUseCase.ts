import { inject, injectable } from "tsyringe";
import { IFeedRepository } from "../../infra/repositories/IFeedRepository";
import { ICreatePostDTO } from "../../dtos/ICreatePostDTO";

@injectable()
export class CreatePostUseCase {
  constructor(
    @inject("FeedRepository")
    private feedRepository: IFeedRepository
  ) {}

  async execute({
    content,
    userId,
    timelinedOwnerId,
  }: ICreatePostDTO): Promise<void> {
    await this.feedRepository.createPost({
      content,
      userId,
      timelinedOwnerId,
    });
  }
}
