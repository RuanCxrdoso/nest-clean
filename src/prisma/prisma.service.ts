import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client.js'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    })

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
