import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from "typeorm";

@Entity({ name: "post_likes" })
@Unique(["user_id", "post_id"])
export class PostLike {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "char", length: 36 })
  user_id: string;

  @Column({ type: "char", length: 36 })
  post_id: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @ManyToOne("users", "post_likes", { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: any;

  @ManyToOne("posts", "post_likes", { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post: any;
}
