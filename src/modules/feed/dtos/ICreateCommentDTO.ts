export type ICreateCommentDTO = {
  postId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
};
