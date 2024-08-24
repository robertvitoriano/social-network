import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddFriendshipColumnToMessage1724480508539
  implements MigrationInterface
{
  name = "AddFriendshipColumnToMessage1724480508539";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "messages",
      new TableColumn({
        name: "friendship_id",
        type: "char",
        length: "36",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "messages",
      new TableForeignKey({
        name: "FK_friendship_id",
        columnNames: ["friendship_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "friendship",
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("messages", "FK_friendship_id");
    await queryRunner.dropColumn("messages", "friendship_id");
  }
}
