import { inject, injectable } from "tsyringe";
import { IListUserPostsParams, IListUserPostsResult, IPost } from "./types";
import { IFeedRepository } from "../../infra/repositories/IFeedRepository";

@injectable()
export class ListUserFeedPostsUseCase {
  constructor(
    @inject("FeedRepository")
    private feedRepository: IFeedRepository
  ) {}

  async execute({
    userId,
    page,
  }: IListUserPostsParams): Promise<IListUserPostsResult> {
    const postsPerPage = 25;
    const posts: IPost[] = await this.feedRepository.listUserTimelinePosts({
      userId,
      page,
      postsPerPage,
    });
    const total = await this.feedRepository.getPostsCount(userId);
    const totalPages: number = Math.ceil(total / postsPerPage);
    return { posts, currentPage: page, totalPages };
  }
}
