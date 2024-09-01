export interface IListFeedPostsParams {
  userId: string;
  page: number;
  postsPerPage?: number;
  friendIds?: string[];
}
export type IComment = {
  id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};
export type IPost = {
  id: string;
  content: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  lastComment: IComment | null;
  comments: IComment[] | null;
  user: {
    id: string;
    name: string;
    avatar: string | null;
    email: string;
  };
};

export interface IListFeedPostsResult {
  posts: IPost[];
  totalPages: number;
  currentPage: number;
}
