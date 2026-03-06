import { EnvService } from '@/infra/env/env.service'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { createClient, RedisClientType } from 'redis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public client: RedisClientType

  constructor(envService: EnvService) {
    const redisUrl = envService.get('REDIS_URL')

    this.client = createClient({
      url: redisUrl,
    })

    this.client.on('error', (err) => console.log('Redis Client Error', err))
  }

  async onModuleInit() {
    await this.client.connect()
    console.log('🚀 Connected to Redis!')
  }

  async onModuleDestroy() {
    return this.client.destroy()
  }
}
