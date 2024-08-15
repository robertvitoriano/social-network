const dotEnv = require('dotenv')
const path = require('path');
dotEnv.config()
const isProduction = process.env.ENVIRONMENT === 'prod';

const User = isProduction
  ? require(path.join(__dirname, 'dist/src/modules/accounts/infra/typeorm/entities/User')).User
  : require(path.join(__dirname, 'src/modules/accounts/infra/typeorm/entities/User')).User;

const Friendship = isProduction
  ? require(path.join(__dirname, 'dist/src/modules/friendships/infra/typeorm/entities/Friendship')).Friendship
  : require(path.join(__dirname, 'src/modules/friendships/infra/typeorm/entities/Friendship')).Friendship;

const Notification = isProduction
  ? require(path.join(__dirname, 'dist/src/modules/notifications/infra/typeorm/entities/Notification')).Notification
  : require(path.join(__dirname, 'src/modules/notifications/infra/typeorm/entities/Notification')).Notification;

const Message = isProduction
  ? require(path.join(__dirname, 'dist/src/modules/chat/infra/typeorm/entities/Message')).Message
  : require(path.join(__dirname, 'src/modules/chat/infra/typeorm/entities/Message')).Message;

const NotificationType = isProduction
  ? require(path.join(__dirname, 'dist/src/modules/notifications/infra/typeorm/entities/NotificationType')).NotificationType
  : require(path.join(__dirname, 'src/modules/notifications/infra/typeorm/entities/NotificationType')).NotificationType;

const ormConfig = {
  type: 'mysql',
  host: process.env.MYSQLDB_HOST,
  port: parseInt(process.env.MYSQLDB_LOCAL_PORT, 10),
  username: process.env.MYSQLDB_USER,
  password: process.env.MYSQLDB_ROOT_PASSWORD,
  database: process.env.MYSQLDB_DATABASE,
  migrations: isProduction
    ? ['./dist/src/shared/infra/typeorm/migrations/*.{js}']
    : ['./src/shared/infra/typeorm/migrations/*.{ts,js}'],
  entities: [User, Friendship, NotificationType, Notification, Message],
  logging: !isProduction,
  cli: {
    migrationsDir: './src/shared/infra/typeorm/migrations'
  }
};

module.exports = ormConfig;
