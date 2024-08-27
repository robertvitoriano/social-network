import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddTimelineOwnerIdToPostTable1724764424349
  implements MigrationInterface
{
  name = "AddTimelineOwnerIdToPostTable1724764424349";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "posts",
      new TableColumn({
        name: "timeline_owner_id",
        type: "char",
        length: "36",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "posts",
      new TableForeignKey({
        name: "FK_timeline_owner_id",
        columnNames: ["timeline_owner_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("posts", "FK_timeline_owner_id");
    await queryRunner.dropColumn("posts", "timeline_owner_id");
  }
}
