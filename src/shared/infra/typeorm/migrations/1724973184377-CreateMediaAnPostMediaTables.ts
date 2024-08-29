import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from "typeorm";

export class CreateMediaAnPostMediaTables1724973184377
  implements MigrationInterface
{
  name = "CreateMediaAnPostMediaTables1724973184377";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "media",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "url",
            type: "varchar",
            length: "255",
          },
          {
            name: "type",
            type: "enum",
            enum: ["picture", "video"],
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "description",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "post_media",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "post_id",
            type: "char",
            length: "36",
          },
          {
            name: "media_id",
            type: "char",
            length: "36",
          },
        ],
      })
    );

    await queryRunner.createUniqueConstraint(
      "post_media",
      new TableUnique({
        name: "UQ_post_media",
        columnNames: ["post_id", "media_id"],
      })
    );

    await queryRunner.createForeignKey(
      "post_media",
      new TableForeignKey({
        columnNames: ["post_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "posts",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "post_media",
      new TableForeignKey({
        columnNames: ["media_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "media",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const postMediaTable = await queryRunner.getTable("post_media");
    const postForeignKey = postMediaTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("post_id") !== -1
    );
    const mediaForeignKey = postMediaTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("media_id") !== -1
    );

    if (postForeignKey) {
      await queryRunner.dropForeignKey("post_media", postForeignKey);
    }

    if (mediaForeignKey) {
      await queryRunner.dropForeignKey("post_media", mediaForeignKey);
    }

    await queryRunner.dropTable("post_media");
    await queryRunner.dropTable("media");
  }
}
