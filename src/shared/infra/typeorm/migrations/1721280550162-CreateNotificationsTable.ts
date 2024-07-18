import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNotificationsTable1721280550162
  implements MigrationInterface
{
  name = "CreateNotificationsTable1721280550162";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "notifications",
        columns: [
          {
            name: "id",
            type: "char",
            length: "36",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "notification_type_id",
            type: "char",
            length: "36",
            isNullable: false,
          },
          {
            name: "sender_id",
            type: "char",
            length: "36",
            isNullable: false,
          },
          {
            name: "receiver_id",
            type: "char",
            length: "36",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["notification_type_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "notification_types",
            onDelete: "CASCADE",
          },
          {
            columnNames: ["sender_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
          },
          {
            columnNames: ["receiver_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("notifications");
  }
}
