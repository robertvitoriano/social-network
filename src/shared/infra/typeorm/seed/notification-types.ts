import dotEnv from "dotenv";
import { DatabaseConnection } from "../DatabaseConnection";
import { env } from "src/config/env";
dotEnv.config();
async function create() {
  const dbConnection = new DatabaseConnection();
  const connection = await dbConnection.connect(env.MYSQLDB_HOST);
  await connection.query(`
    INSERT INTO notification_types (id, type, created_at)
    VALUES 
      ('1', 'FRIENDSHIP_REQUEST', NOW()),
      ('2', 'FRIENDSHIP_ACCEPTED', NOW()),
      ('3', 'MESSAGE_RECEIVED', NOW())
    ON DUPLICATE KEY UPDATE 
      type = VALUES(type),
      created_at = VALUES(created_at)
  `);

  await connection.close();
}

create().then(() => {
  console.info("notification types created");
});
