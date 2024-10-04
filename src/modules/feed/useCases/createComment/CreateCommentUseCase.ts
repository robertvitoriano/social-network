import { inject, injectable } from "tsyringe";
import { IFeedRepository } from "../../infra/repositories/IFeedRepository";
import { ICreateCommentDTO } from "../../dtos/ICreateCommentDTO";

@injectable()
export class CreateCommentUseCase {
  constructor(
    @inject("FeedRepository")
    private feedRepository: IFeedRepository
  ) {}

  async execute({
    content,
    userId,
    postId,
    parentCommentId,
  }: ICreateCommentDTO): Promise<void> {
    await this.feedRepository.createComment({
      parentCommentId,
      content,
      userId,
      postId,
    });
  }
}
