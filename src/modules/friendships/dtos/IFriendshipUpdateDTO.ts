export interface IFriendshipUpdateDTO {
  friendId: string;
  userId: string;
  status: "accepted" | "rejected";
}
