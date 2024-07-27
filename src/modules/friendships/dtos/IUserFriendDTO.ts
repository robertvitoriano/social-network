export interface IUserFriendDTO {
  id: string;
  name: string;
  email: string;
  username: string;
  isAdmin: boolean;
  created_at: Date;
  friendshipRequestStatus?: "sent" | "received" | "not_sent";
}
