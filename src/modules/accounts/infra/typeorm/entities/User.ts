import { Entity, Column, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

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

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
