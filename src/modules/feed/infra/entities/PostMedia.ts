import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity({ name: "post_media" })
export class PostMedia {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "char", length: 36 })
  post_id: string;

  @Column({ type: "char", length: 36 })
  media_id: string;

  @ManyToOne("posts", "postMedia", { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post: any;

  @ManyToOne("media", "postMedia", { onDelete: "CASCADE" })
  @JoinColumn({ name: "media_id" })
  media: any;
}
