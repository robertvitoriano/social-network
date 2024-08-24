import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "char", length: 36 })
  receiver_id: string;

  @Column({ type: "char", length: 36 })
  sender_id: string;

  @Column({ type: "char", length: 36 })
  notification_id: string;

  @Column({ type: "char", length: 36 })
  friendship_id: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @ManyToOne("User", "sentMessages", { onDelete: "CASCADE" })
  @JoinColumn({ name: "sender_id" })
  sender!: any;

  @ManyToOne("User", "receivedMessages", { onDelete: "CASCADE" })
  @JoinColumn({ name: "receiver_id" })
  receiver!: any;

  @OneToOne("notifications", "message", {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "notification_id" })
  messageNotification: any;
}
