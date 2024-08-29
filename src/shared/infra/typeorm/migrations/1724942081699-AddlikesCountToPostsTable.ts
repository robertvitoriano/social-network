import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddlikesCountToPostsTable1724942081699
  implements MigrationInterface
{
  name = "AddlikesCountToPostsTable1724942081699";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "posts",
      new TableColumn({
        name: "likes_count",
        type: "int",
        isNullable: false,
        default: 0,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("posts", "likes_count");
  }
}
