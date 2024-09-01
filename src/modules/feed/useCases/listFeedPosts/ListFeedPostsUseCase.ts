import { inject, injectable } from "tsyringe";
import { IListFeedPostsParams, IListFeedPostsResult, IPost } from "./types";
import { IFeedRepository } from "../../infra/repositories/IFeedRepository";
import { IFriendshipsRepository } from "../../../friendships/repositories/IFriendshipsRepository";

@injectable()
export class ListFeedPostsUseCase {
  constructor(
    @inject("FeedRepository")
    private feedRepository: IFeedRepository,
    @inject("FriendshipRepository")
    private friendshipRepository: IFriendshipsRepository
  ) {}

  async execute({
    userId,
    page,
  }: IListFeedPostsParams): Promise<IListFeedPostsResult> {
    const postsPerPage = 25;
    const friendIds = await this.friendshipRepository.getFriendIds(userId);

    const posts: IPost[] = await this.feedRepository.listFeedPosts({
      userId,
      page,
      postsPerPage,
      friendIds,
    });
    const total = await this.feedRepository.getPostsCount(userId);
    const totalPages: number = Math.ceil(total / postsPerPage);
    return { posts, currentPage: page, totalPages };
  }
}
