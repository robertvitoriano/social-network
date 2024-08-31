import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateCommentLikeTable1725101490164 implements MigrationInterface {
  name = "CreateCommentLikeTable1725101490164";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "comment_likes",
        columns: [
          {
            name: "id",
            type: "char",
            length: "36",
            isPrimary: true,
          },
          {
            name: "user_id",
            type: "char",
            length: "36",
            isNullable: false,
          },
          {
            name: "comment_id",
            type: "char",
            length: "36",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "comment_likes",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "comment_likes",
      new TableForeignKey({
        columnNames: ["comment_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "comments",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "comment_likes",
      new TableIndex({
        name: "IDX_USER_comment_UNIQUE",
        columnNames: ["user_id", "comment_id"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("comment_likes");

    const foreignKeyUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("user_id") !== -1
    );
    const foreignKeycomment = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("comment_id") !== -1
    );
    const index = table.indices.find(
      (idx) => idx.name === "IDX_USER_comment_UNIQUE"
    );

    if (index) {
      await queryRunner.dropIndex("comment_likes", "IDX_USER_comment_UNIQUE");
    }
    if (foreignKeyUser) {
      await queryRunner.dropForeignKey("comment_likes", foreignKeyUser);
    }
    if (foreignKeycomment) {
      await queryRunner.dropForeignKey("comment_likes", foreignKeycomment);
    }
    await queryRunner.dropTable("comment_likes");
  }
}
