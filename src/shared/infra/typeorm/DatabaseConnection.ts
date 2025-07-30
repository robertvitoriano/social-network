import { env } from "src/config/env";
import { Connection, createConnection, getConnectionOptions } from "typeorm";

class DatabaseConnection {
  public async connect(
    host: string = env.MYSQLDB_HOST
  ): Promise<Connection> {
    const defaultOptions = await getConnectionOptions();
    return createConnection(
      Object.assign(defaultOptions, {
        database:env.MYSQLDB_DATABASE,
        username:env.MYSQLDB_USER,
        host,
        password:env.MYSQLDB_ROOT_PASSWORD,
      })
    );
  }
}

export { DatabaseConnection };
