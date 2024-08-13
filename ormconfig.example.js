const isProduction = process.env.ENVIRONMENT === 'prod';

const ormConfig = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "123",
  database: "social_network_db",
  migrations: isProduction ? ["./dist/src/shared/infra/typeorm/migrations/*.{js}"] : ["./src/shared/infra/typeorm/migrations/*.{ts,js}"],
  entities: isProduction ? ["./dist/src/modules/**/entities/*.{js}"] : ["./src/modules/**/entities/*.{ts,js}"],
  logging: false,
  cli: {
    migrationsDir: "./src/shared/infra/typeorm/migrations"
  }
};

module.exports = ormConfig;
