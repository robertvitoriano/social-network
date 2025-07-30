const dotEnv = require('dotenv')
const path = require('path');
const env = require("./src/config/env")
dotEnv.config()
const isProduction = env.ENVIRONMENT === 'prod';

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
  
  const PostLike = isProduction
  ? require(path.join(__dirname, 'dist/src/modules/feed/infra/entities/PostLike')).PostLike
  : require(path.join(__dirname, 'src/modules/feed/infra/entities/PostLike')).PostLike;
  
  const Post = isProduction
  ? require(path.join(__dirname, 'dist/src/modules/feed/infra/entities/Post')).Post
  : require(path.join(__dirname, 'src/modules/feed/infra/entities/Post')).Post;
  
  const Media = isProduction
  ? require(path.join(__dirname, 'dist/src/modules/feed/infra/entities/Media')).Media
  : require(path.join(__dirname, 'src/modules/feed/infra/entities/Media')).Media;
  
  const PostMedia = isProduction
  ? require(path.join(__dirname, 'dist/src/modules/feed/infra/entities/PostMedia')).PostMedia
  : require(path.join(__dirname, 'src/modules/feed/infra/entities/PostMedia')).PostMedia;

  const Comment = isProduction
  ? require(path.join(__dirname, 'dist/src/modules/feed/infra/entities/Comment')).Comment
  : require(path.join(__dirname, 'src/modules/feed/infra/entities/Comment')).Comment;
  
  const CommentLike = isProduction
  ? require(path.join(__dirname, 'dist/src/modules/feed/infra/entities/CommentLike')).CommentLike
  : require(path.join(__dirname, 'src/modules/feed/infra/entities/CommentLike')).CommentLike;
  
const ormConfig = {
  type: 'mysql',
  host: env.MYSQLDB_HOST,
  port: parseInt(env.MYSQLDB_LOCAL_PORT, 10),
  username: env.MYSQLDB_USER,
  password: env.MYSQLDB_ROOT_PASSWORD,
  database: env.MYSQLDB_DATABASE,
  migrations: isProduction
    ? ['./dist/src/shared/infra/typeorm/migrations/*.{js}']
    : ['./src/shared/infra/typeorm/migrations/*.{ts,js}'],
  entities: [User, Friendship, NotificationType, Notification, Message, Post, Media, PostMedia, PostLike, Comment, CommentLike],
  logging: false,
  cli: {
    migrationsDir: './src/shared/infra/typeorm/migrations'
  }
};

module.exports = ormConfig;
