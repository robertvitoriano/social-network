export interface IListUserMessagesParams {
  friendId: string;
  userId: string;
  page: number;
  messagesPerPage?: number;
}
export type IMessage = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
};

export interface IListUserMessagesResult {
  messages: IMessage[];
  totalPages: number;
  currentPage: number;
}
