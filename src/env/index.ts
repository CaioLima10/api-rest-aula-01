import { config } from 'dotenv'
import { z } from 'zod'

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log('⚠ Invalid environment valiables', _env.error.format())

  throw new Error('⚠ Invalid environment valiables')
}

const env = _env.data

export { env }
