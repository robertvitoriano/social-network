import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddNotificationColumnToMessage1723967430806
  implements MigrationInterface
{
  name = "AddNotificationColumnToMessage1723967430806";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "messages",
      new TableColumn({
        name: "notification_id",
        type: "char",
        length: "36",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "messages",
      new TableForeignKey({
        name: "FK_notification_id",
        columnNames: ["notification_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "notifications",
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("messages", "FK_notification_id");
    await queryRunner.dropColumn("messages", "notification_id");
  }
}
