import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";
import { Friendship } from "../../../../friendships/infra/typeorm/entities/Friendship";
import { Message } from "../../../../chat/infra/typeorm/entities/Message";
import { Post } from "../../../../feed/infra/entities/Post";

@Entity("users")
export class User {
  @PrimaryColumn({ type: "char", length: "36" })
  id!: string;

  @Column({ type: "varchar", length: "255" })
  name!: string;

  @Column({ type: "varchar", length: "255", unique: true })
  username!: string;

  @Column({ type: "varchar", length: "255" })
  password!: string;

  @Column({ type: "varchar", length: "255" })
  email!: string;

  @Column({ type: "boolean", default: false })
  isAdmin!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "varchar", nullable: true })
  avatar!: string;

  @Column({ type: "varchar", nullable: true })
  cover!: string;

  @Column({ type: "boolean", default: false })
  online: boolean;

  @OneToMany(() => Friendship, (friendship) => friendship.user)
  friendships!: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.friend)
  friends!: Friendship[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];

  @OneToMany(() => Post, (post: Post) => post.timeLineOwner)
  timelinePosts: Post[];
  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
