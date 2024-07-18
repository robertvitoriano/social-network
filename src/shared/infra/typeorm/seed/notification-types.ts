import createConnection from "./../index";

const defaultHost =
  process.env.ENVIRONMENT === "prod" ? process.env.MYSQLDB_HOST : "localhost";
async function create() {
  const connection = await createConnection(defaultHost);

  await connection.query(`
  INSERT INTO notification_types (id, type,  created_at)
    VALUES ('1', 'FRIENDSHIP_REQUEST',  NOW())
  `);

  await connection.query(`
    INSERT INTO notification_types (id, type,  created_at)
      VALUES ('2', 'FRIENDSHIP_ACCEPTED',  NOW())
    `);

  await connection.close();
}
create().then(() => {
  console.info("notification types created");
});
