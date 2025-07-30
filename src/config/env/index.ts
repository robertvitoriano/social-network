import { config } from 'dotenv'
import { z } from 'zod'


config({ path: '.env.local' })

const envSchema = z.object({
  MYSQLDB_USER: z.string(),
  MYSQLDB_HOST: z.string(),
  MYSQLDB_ROOT_PASSWORD: z.string(),
  MYSQLDB_DATABASE: z.string(),
  MYSQLDB_LOCAL_PORT: z.coerce.number().default(3306),
  MYSQLDB_DOCKER_PORT: z.coerce.number().default(3306),
  
  REDIS_URL: z.string(),

  API_SECRET_KEY: z.string(),

  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  
  S3_BUCKET: z.string(),

  LANG: z.string().default('en_US.UTF-8'),
  ENVIRONMENT: z.enum(['dev', 'development', 'test', 'production', 'prod']).default('dev'),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string().url(),
  CLIENT_URL: z.string().url(),

  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
