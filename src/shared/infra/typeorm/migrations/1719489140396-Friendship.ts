import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class Friendship1719489140396 implements MigrationInterface {
  name = "Friendship1719489140396";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "friendship",
        columns: [
          {
            name: "id",
            type: "char",
            length: "36",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "user_id",
            type: "char",
            length: "36",
            isNullable: false,
          },
          {
            name: "friend_id",
            type: "char",
            length: "36",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "accepted", "rejected"],
            default: "'pending'",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "friendship",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "friendship",
      new TableForeignKey({
        columnNames: ["friend_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("friendship", "FK_friendship_user_id");
    await queryRunner.dropForeignKey("friendship", "FK_friendship_friend_id");

    await queryRunner.dropTable("friendship");
  }
}
