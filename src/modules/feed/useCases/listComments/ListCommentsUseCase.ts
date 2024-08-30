import { inject, injectable } from "tsyringe";
import { IListCommentsParams, IListCommentsResult } from "./types";
import { IFeedRepository } from "../../infra/repositories/IFeedRepository";
import { IPost } from "../listUserPosts/types";

@injectable()
export class ListCommentsUseCase {
  constructor(
    @inject("FeedRepository")
    private feedRepository: IFeedRepository
  ) {}

  async execute({
    page,
    postId,
  }: IListCommentsParams): Promise<IListCommentsResult> {
    const commentsPerPage = 25;
    const comments: IPost[] = await this.feedRepository.listComments({
      postId,
      page,
      commentsPerPage,
    });
    const total = await this.feedRepository.getCommentsCount(postId);
    const totalPages: number = Math.ceil(total / commentsPerPage);
    return { comments, currentPage: page, totalPages };
  }
}
