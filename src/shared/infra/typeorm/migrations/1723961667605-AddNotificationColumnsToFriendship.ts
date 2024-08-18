import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddNotificationColumnsToFriendship1723961667605
  implements MigrationInterface
{
  name = "AddNotificationColumnsToFriendship1723961667605";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "friendship",
      new TableColumn({
        name: "request_notification_id",
        type: "char",
        length: "36",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "friendship",
      new TableColumn({
        name: "accepted_notification_id",
        type: "char",
        length: "36",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "friendship",
      new TableForeignKey({
        columnNames: ["request_notification_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "notifications",
        onDelete: "SET NULL",
      })
    );

    await queryRunner.createForeignKey(
      "friendship",
      new TableForeignKey({
        columnNames: ["accepted_notification_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "notifications",
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      "friendship",
      "FK_friendship_request_notification_id"
    );
    await queryRunner.dropForeignKey(
      "friendship",
      "FK_friendship_accepted_notification_id"
    );

    await queryRunner.dropColumn("friendship", "request_notification_id");
    await queryRunner.dropColumn("friendship", "accepted_notification_id");
  }
}
