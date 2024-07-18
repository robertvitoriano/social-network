import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Notification } from "./Notification";

@Entity("notification_types")
export class NotificationType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "char", length: "36" })
  type: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(
    () => Notification,
    (notification) => notification.notificationType
  )
  notifications: Notification[];
}
