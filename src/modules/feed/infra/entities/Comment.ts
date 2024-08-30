import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";

@Entity({ name: "comments" })
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "char", length: 36 })
  user_id: string;

  @Column({ type: "char", length: 36 })
  post_id: string;

  @Column({ type: "text", nullable: true })
  content: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @Column({ type: "int", default: 0 })
  likes_count: number;

  @ManyToOne("users", "comments", { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: any;

  @ManyToOne("posts", "comments", { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post!: any;
}
