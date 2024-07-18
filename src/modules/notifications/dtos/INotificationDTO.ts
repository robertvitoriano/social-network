export interface INotificationDTO {
  id: string;
  notification_type_id: number;
  sender_id: string;
  receiver_id: string;
  created_at: Date;
}
