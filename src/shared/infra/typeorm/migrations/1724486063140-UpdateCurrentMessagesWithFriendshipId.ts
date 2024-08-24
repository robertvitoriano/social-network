import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCurrentMessagesWithFriendshipId1724486063140
  implements MigrationInterface
{
  name = "UpdateCurrentMessagesWithFriendshipId1724486063140";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE messages m
            JOIN friendship f
                ON (m.sender_id = f.user_id AND m.receiver_id = f.friend_id)
                OR (m.sender_id = f.friend_id AND m.receiver_id = f.user_id)
            SET m.friendship_id = f.id;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE messages
            SET friendship_id = NULL;
        `);
  }
}
