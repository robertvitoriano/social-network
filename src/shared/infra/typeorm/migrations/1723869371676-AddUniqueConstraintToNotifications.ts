import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddUniqueConstraintToNotifications1723869371676
  implements MigrationInterface
{
  name = "AddUniqueConstraintToNotifications1723869371676";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      "notifications",
      new TableIndex({
        name: "IDX_UNIQUE_NOTIFICATION",
        columnNames: ["sender_id", "receiver_id", "notification_type_id"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("notifications", "IDX_UNIQUE_NOTIFICATION");
  }
}
