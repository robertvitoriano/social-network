export default interface ICreateChatMessageDTO {
  senderId: string;
  receiverId: string;
  content: string;
  notificationId: string;
  friendshipId: string;
}
