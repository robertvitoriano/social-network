import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePostTable1724759293536 implements MigrationInterface {
  name = "CreatePostTable1724759293536";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "posts",
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
            name: "content",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
          {
            name: "is_private",
            type: "boolean",
            default: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("posts");
  }
}
