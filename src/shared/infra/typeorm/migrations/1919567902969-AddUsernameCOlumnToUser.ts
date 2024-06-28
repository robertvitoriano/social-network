import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUsernameCOlumnToUser1719567902969
  implements MigrationInterface
{
  name = "AddUsernameCOlumnToUser1719567902969";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "username",
        type: "varchar",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "username");
  }
}
