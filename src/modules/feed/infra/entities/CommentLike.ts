import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from "typeorm";

@Entity({ name: "comment_likes" })
@Unique(["user_id", "comment_id"])
export class CommentLike {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "char", length: 36 })
  user_id: string;

  @Column({ type: "char", length: 36 })
  comment_id: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @ManyToOne("users", "comment_likes", { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: any;

  @ManyToOne("comments", "comment_likes", { onDelete: "CASCADE" })
  @JoinColumn({ name: "comment_id" })
  comment: any;
}
