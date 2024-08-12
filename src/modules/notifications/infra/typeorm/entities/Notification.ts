import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { NotificationType } from "./NotificationType";
import { User } from "../../../../accounts/infra/typeorm/entities/User";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "char", length: "36" })
  notification_type_id: number;

  @Column({ type: "char", length: "36" })
  sender_id: string;

  @Column({ type: "char", length: "36" })
  receiver_id: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "boolean", default: false })
  read: boolean;

  @ManyToOne(
    () => NotificationType,
    (notificationType) => notificationType.notifications,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "notification_type_id" })
  notificationType: NotificationType;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "receiver_id" })
  receiver: User;
}
