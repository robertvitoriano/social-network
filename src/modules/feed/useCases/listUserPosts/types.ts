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
  likesCount: number;
  commentsCount: number;
  lastComment: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      avatar: string | null;
    };
  } | null;
  creator: {
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
