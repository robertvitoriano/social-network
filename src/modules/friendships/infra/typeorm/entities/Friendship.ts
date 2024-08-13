import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity("friendship")
export class Friendship {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "char", length: "36" })
  user_id: string;

  @Column({ type: "char", length: "36" })
  friend_id: string;

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
}
