import createConnection from "./../index";

const defaultHost =
  process.env.ENVIRONMENT === "dev" ? "mysqldb" : process.env.MYSQLDB_HOST;

async function create() {
  const connection = await createConnection(defaultHost);

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
