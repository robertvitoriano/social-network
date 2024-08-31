import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";

@Entity({ name: "posts" })
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "char", length: 36 })
  timeline_owner_id: string;

  @Column({ type: "char", length: 36 })
  user_id: string;

  @Column({ type: "text", nullable: true })
  content: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @Column({ type: "int", default: 0 })
  likes_count: number;

  @Column({ type: "int", default: 0 })
  comments_count: number;

  @Column({ type: "boolean", default: false })
  is_private: boolean;

  @ManyToOne("users", "posts", { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: any;

  @ManyToOne("users", "posts", { onDelete: "CASCADE" })
  @JoinColumn({ name: "timeline_owner_id" })
  timeLineOwner: any;

  @OneToMany("post_media", "posts")
  media: any[];

  @OneToMany("post_likes", "posts")
  likes: any[];

  @OneToMany("comments", "post")
  comments: any[];
}
