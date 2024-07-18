import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNotificationsTypeTable1721280492289
  implements MigrationInterface
{
  name = "CreateNotificationsTypeTable1721280492289";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "notification_types",
        columns: [
          {
            name: "id",
            type: "char",
            length: "36",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "type",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("notification_type");
  }
}
