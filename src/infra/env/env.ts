import z from 'zod'

export const envSchema = z.object({
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string(),
  DATABASE_SCHEMA: z.string().default('public'),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  NODE_ENV: z
    .enum(['production', 'development', 'test'])
    .default('development'),
})

export type Env = z.infer<typeof envSchema>
