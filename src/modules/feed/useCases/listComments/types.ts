export type IComment = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
};
export interface IListCommentsParams {
  page: number;
  commentsPerPage?: number;
  postId: string;
}

export interface IListCommentsResult {
  comments: IComment[];
  totalPages: number;
  currentPage: number;
}
