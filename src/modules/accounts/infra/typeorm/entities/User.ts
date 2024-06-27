import { v4 as uuid } from "uuid";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  created_at: Date;

  @Column()
  isAdmin: boolean;

  @Column()
  avatar: string;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
