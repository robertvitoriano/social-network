export interface IListUserPostsParams {
  handle: string;
  page: number;
  postsPerPage?: number;
}
export type IComment = {
  id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  parentCommentId?: string;
  replies: IComment[];
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
  lastComment?: IComment | null;
  comments: IComment[] | null;
  user: {
    id: string;
    name: string;
    avatar: string | null;
    email: string;
  };
};

export interface IListUserPostsResult {
  posts: IPost[];
  totalPages: number;
  currentPage: number;
}
