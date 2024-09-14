export interface IUserFriendDTO {
  friendshipId: string;
  id: string;
  online?: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  createdAt?: string;
  lastMessage?: string;
  lastMessageCreatedAt?: string;
  friendshipRequestStatus?: "sent" | "received" | "not_sent";
  isAdmin?: boolean;
  created_at?: Date;
}
