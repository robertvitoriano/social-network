import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
@Entity("friendship")
export class Friendship {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "char", length: "36" })
  user_id: string;

  @Column({ type: "char", length: "36" })
  friend_id: string;

  @Column({ type: "uuid", nullable: true })
  request_notification_id: string;

  @Column({ type: "uuid", nullable: true })
  accepted_notification_id: string;

  @Column({
    type: "enum",
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  })
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @ManyToOne("User", "friendships", { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: any;

  @ManyToOne("User", "friends", { onDelete: "CASCADE" })
  @JoinColumn({ name: "friend_id" })
  friend!: any;
  @OneToOne("notifications", "friendship", {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "request_notification_id" })
  requestNotification: any;

  @OneToOne("notifications", "friendship", {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "accepted_notification_id" })
  acceptedNotification: any;

  @OneToMany("messages", "friendship", { onDelete: "CASCADE" })
  messages!: any;
}
