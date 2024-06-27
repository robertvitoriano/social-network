import createConnection from "./../index";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcrypt";

const defaultHost =
  process.env.ENVIRONMENT === "prod" ? process.env.MYSQLDB_HOST : "localhost";
async function create() {
  const connection = await createConnection(defaultHost);
  const password = await hash("123456", 8);
  const id = uuidV4();

  await connection.query(`
  INSERT INTO USERS (id, name, email, password, "isAdmin", created_at)
    VALUES ('${id}', 'robert Admin', 'robertvitoriano5@gmail.com', '${password}', true, NOW(), 'XXXXX')
  `);
  await connection.close();
}
create().then(() => {
  console.info("Admin created");
});
