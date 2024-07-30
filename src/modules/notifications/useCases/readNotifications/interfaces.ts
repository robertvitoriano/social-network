export interface INotification {
  read: boolean;
  receiverId: string;
  senderId: string;
  notificationType: string;
  created_at: Date;
}
