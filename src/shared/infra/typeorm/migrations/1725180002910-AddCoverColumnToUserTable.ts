import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCoverColumnToUserTable1725180002910
  implements MigrationInterface
{
  name = "AddCoverColumnToUserTable1725180002910";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "cover",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "cover");
  }
}
