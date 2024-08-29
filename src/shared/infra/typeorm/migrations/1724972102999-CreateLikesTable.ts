import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from "typeorm";

export class CreateLikesTable1724972102999 implements MigrationInterface {
  name = "CreateLikesTable1724972102999";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "likes",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "post_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "target",
            type: "enum",
            enum: ["post", "comment"],
            default: "post",
            isNullable: false,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "likes",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "likes",
      new TableForeignKey({
        columnNames: ["post_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "posts",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createUniqueConstraint(
      "likes",
      new TableUnique({
        columnNames: ["user_id", "post_id"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("likes");
    const foreignKeyUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("user_id") !== -1
    );
    const foreignKeyPost = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("post_id") !== -1
    );

    await queryRunner.dropUniqueConstraint(
      "likes",
      new TableUnique({ columnNames: ["user_id", "post_id"] })
    );
    await queryRunner.dropForeignKey("likes", foreignKeyUser);
    await queryRunner.dropForeignKey("likes", foreignKeyPost);
    await queryRunner.dropTable("likes");
  }
}
