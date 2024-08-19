import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddChattingColumnToFriendship1724075151146
  implements MigrationInterface
{
  name = "AddChattingColumnToFriendship1724075151146";

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.addColumn(
        "friendship",
        new TableColumn({
          name: "chatting",
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
      await queryRunner.dropColumn("friendship", "chatting");
    } catch (error) {
      throw error;
    }
  }
}
