import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from "typeorm";

@Entity({ name: "likes" })
@Unique(["user_id", "post_id"])
export class Like {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "char", length: 36 })
  user_id: string;

  @Column({ type: "char", length: 36 })
  post_id: string;

  @Column({
    type: "enum",
    enum: ["post", "comment"],
    default: "post",
  })
  target: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @ManyToOne("users", "likes", { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: any;

  @ManyToOne("posts", "likes", { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post: any;
}
