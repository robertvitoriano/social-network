import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCommentsCountColumnToPostTable1725023853459
  implements MigrationInterface
{
  name = "AddCommentsCountColumnToPostTable1725023853459";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "posts",
      new TableColumn({
        name: "comments_count",
        type: "int",
        isNullable: false,
        default: 0,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("posts", "comments_count");
  }
}
