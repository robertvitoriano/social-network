import { Connection, createConnection, getConnectionOptions } from "typeorm";

class DatabaseConnection {
  private defaultHost: string;

  constructor() {
    this.defaultHost =
      process.env.ENVIRONMENT === "dev"
        ? "mysqldb"
        : process.env.MYSQLDB_HOST || "localhost";
  }

  public async connect(host: string = this.defaultHost): Promise<Connection> {
    const defaultOptions = await getConnectionOptions();
    return createConnection(
      Object.assign(defaultOptions, {
        host,
      })
    );
  }
}

export { DatabaseConnection };
