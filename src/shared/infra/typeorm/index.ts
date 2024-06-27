import { Connection, createConnection, getConnectionOptions } from "typeorm";

interface IOptions {
  host: string;
}
const defaultHost =
  process.env.ENVIRONMENT === "prod" ? process.env.MYSQLDB_HOST : "mysqldb";

export default async (host = defaultHost): Promise<Connection> => {
  const defaulOptions = await getConnectionOptions();
  return createConnection(
    Object.assign(defaulOptions, {
      host,
    })
  );
};
