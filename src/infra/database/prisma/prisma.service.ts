import 'dotenv/config'
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(env: EnvService) {
    const databaseUrl = env.get('DATABASE_URL')
    const databaseSchema = env.get('DATABASE_SCHEMA')

    const adapter = new PrismaPg(
      {
        connectionString: databaseUrl,
      },
      { schema: databaseSchema },
    )

    super({ adapter })
  }

  async onModuleInit() {
    try {
      await this.$queryRaw`SELECT 1`
      Logger.log('Database connection established successfully.')
    } catch (error) {
      Logger.error('Failed to connect to the database:', error)
      throw error
    }

    return this.$connect()
  }

  async onModuleDestroy() {
    return this.$disconnect()
  }
}
