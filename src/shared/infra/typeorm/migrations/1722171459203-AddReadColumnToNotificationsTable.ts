import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from "typeorm";

export class AddReadColumnToNotificationsTable1722171459203
  implements MigrationInterface
{
  name = "AddReadColumnToNotificationsTable1722171459203";

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.addColumn(
        "notifications",
        new TableColumn({
          name: "read",
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
      await queryRunner.dropColumn("notifications", "read");
    } catch (error) {
      throw error;
    }
  }
}
