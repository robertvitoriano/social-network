export interface IListUserPostsParams {
  userId: string;
  page: number;
  postsPerPage?: number;
}
export type IPost = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
};

export interface IListUserPostsResult {
  posts: IPost[];
  totalPages: number;
  currentPage: number;
}
