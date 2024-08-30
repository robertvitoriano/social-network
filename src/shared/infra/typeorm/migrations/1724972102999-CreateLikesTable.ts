import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
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
            name: "post_id",
            type: "char",
            length: "36",
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
            default: "'post'",
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

    await queryRunner.createIndex(
      "likes",
      new TableIndex({
        name: "IDX_USER_POST_UNIQUE",
        columnNames: ["user_id", "post_id"],
        isUnique: true,
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
    const index = table.indices.find(
      (idx) => idx.name === "IDX_USER_POST_UNIQUE"
    );

    if (index) {
      await queryRunner.dropIndex("likes", "IDX_USER_POST_UNIQUE");
    }
    if (foreignKeyUser) {
      await queryRunner.dropForeignKey("likes", foreignKeyUser);
    }
    if (foreignKeyPost) {
      await queryRunner.dropForeignKey("likes", foreignKeyPost);
    }
    await queryRunner.dropTable("likes");
  }
}
