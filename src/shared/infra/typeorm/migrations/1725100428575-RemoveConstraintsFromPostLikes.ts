import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class RemoveConstraintsFromPostLikes1725100428575
  implements MigrationInterface
{
  name = "RemoveConstraintsFromPostLikes1725100428575";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("likes");

    if (!table) {
      throw new Error("Table 'likes' does not exist.");
    }

    const foreignKeys = table.foreignKeys;
    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey("likes", foreignKey);
    }

    const indices = table.indices;
    for (const index of indices) {
      await queryRunner.dropIndex("likes", index);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      "likes",
      new TableForeignKey({
        name: "FK_9b9a7fc5eeff133cf71b8e06a7b",
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "likes",
      new TableForeignKey({
        name: "FK_b40d37469c501092203d285af80",
        columnNames: ["id"],
        referencedTableName: "posts",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "likes",
      new TableIndex({
        name: "IDX_8f64693922a9e8c4e2605850d0",
        columnNames: ["user_id", "id"],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      "likes",
      new TableIndex({
        name: "FK_b40d37469c501092203d285af80",
        columnNames: ["id"],
      })
    );
  }
}
