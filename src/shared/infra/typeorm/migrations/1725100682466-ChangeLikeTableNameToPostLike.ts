import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class ChangeLikeTableNameToPostLike1725100682466
  implements MigrationInterface
{
  name = "ChangeLikeTableNameToPostLike1725100682466";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("likes", "post_likes");

    await queryRunner.createForeignKey(
      "post_likes",
      new TableForeignKey({
        name: "FK_post_likes_user_id",
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "post_likes",
      new TableForeignKey({
        name: "FK_post_likes_post_id",
        columnNames: ["post_id"],
        referencedTableName: "posts",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "post_likes",
      new TableIndex({
        name: "IDX_USER_POST_UNIQUE_POST_LIKES",
        columnNames: ["user_id", "post_id"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("post_likes", "likes");

    const hasUserForeignKey = await queryRunner.query(
      `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'likes' AND CONSTRAINT_NAME = 'FK_post_likes_user_id'`
    );
    if (hasUserForeignKey.length > 0) {
      await queryRunner.dropForeignKey("likes", "FK_post_likes_user_id");
    }

    const hasPostForeignKey = await queryRunner.query(
      `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'likes' AND CONSTRAINT_NAME = 'FK_post_likes_post_id'`
    );
    if (hasPostForeignKey.length > 0) {
      await queryRunner.dropForeignKey("likes", "FK_post_likes_post_id");
    }

    await queryRunner.createForeignKey(
      "likes",
      new TableForeignKey({
        name: "FK_likes_user_id",
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "likes",
      new TableForeignKey({
        name: "FK_likes_post_id",
        columnNames: ["post_id"],
        referencedTableName: "posts",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    const hasIndex = await queryRunner.query(
      `SHOW INDEX FROM likes WHERE Key_name = 'IDX_USER_POST_UNIQUE_POST_LIKES'`
    );
    if (hasIndex.length > 0) {
      await queryRunner.dropIndex("likes", "IDX_USER_POST_UNIQUE_POST_LIKES");
    }

    await queryRunner.createIndex(
      "likes",
      new TableIndex({
        name: "IDX_USER_POST_UNIQUE",
        columnNames: ["user_id", "post_id"],
        isUnique: true,
      })
    );
  }
}
