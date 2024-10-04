import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddParentCommentIdToCommentTable1728002470837
  implements MigrationInterface
{
  name = "AddParentCommentIdToCommentTable1728002470837";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "comments",
      new TableColumn({
        name: "parent_comment_id",
        type: "char",
        length: "36",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "comments",
      new TableForeignKey({
        name: "FK_parent_comment_id",
        columnNames: ["parent_comment_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "comments",
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("comments", "FK_parent_comment_id");
    await queryRunner.dropColumn("comments", "parent_comment_id");
  }
}
