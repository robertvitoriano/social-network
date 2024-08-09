import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";
import { Friendship } from "@modules/friendships/infra/typeorm/entities/Friendship";
import { Message } from "@modules/chat/infra/typeorm/entities/Message";

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
  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
