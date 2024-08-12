import { v4 as uuidV4 } from "uuid";
import { hash } from "bcrypt";
import { DatabaseConnection } from "../DatabaseConnection";

async function create() {
  const defaultHost =
    process.env.ENVIRONMENT === "dev" ? "mysqldb" : process.env.MYSQLDB_HOST;
  const dbConnection = new DatabaseConnection();
  const connection = await dbConnection.connect(defaultHost);
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
