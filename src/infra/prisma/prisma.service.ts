import 'dotenv/config'
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { ConfigService } from '@nestjs/config'
import { Env } from '@/infra/env'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(@Inject(ConfigService) config: ConfigService<Env, true>) {
    const databaseUrl = config.get('DATABASE_URL', { infer: true })
    const databaseSchema = config.get('DATABASE_SCHEMA', { infer: true })

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
