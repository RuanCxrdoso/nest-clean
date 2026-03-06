import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { DomainEvents } from '@/core/events/domain-events'

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  // postgresql://admin:admin/localhost:5432/my-db?schema=uuid
  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()
let prisma: PrismaClient

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseUrl
  process.env.DATABASE_SCHEMA = schemaId

  const adapter = new PrismaPg(
    {
      connectionString: databaseUrl,
    },
    {
      schema: schemaId,
    },
  )
  prisma = new PrismaClient({ adapter })

  DomainEvents.shouldRun = false

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
