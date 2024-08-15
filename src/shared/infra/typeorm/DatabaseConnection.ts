import { Connection, createConnection, getConnectionOptions } from "typeorm";

class DatabaseConnection {
  public async connect(
    host: string = process.env.MYSQLDB_HOST
  ): Promise<Connection> {
    const defaultOptions = await getConnectionOptions();
    return createConnection(
      Object.assign(defaultOptions, {
        host,
      })
    );
  }
}

export { DatabaseConnection };
