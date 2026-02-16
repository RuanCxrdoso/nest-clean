import z from 'zod'

export const envSchema = z.object({
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  NODE_ENV: z
    .enum(['production', 'development', 'test'])
    .default('development'),
})

export type Env = z.infer<typeof envSchema>
