import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddOnlineColumnToUsersTable1723207321545
  implements MigrationInterface
{
  name = "AddOnlineColumnToUsersTable1723207321545";

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.addColumn(
        "users",
        new TableColumn({
          name: "online",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.dropColumn("users", "online");
    } catch (error) {
      throw error;
    }
  }
}
