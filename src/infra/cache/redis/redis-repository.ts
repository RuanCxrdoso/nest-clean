import { ICacheRepository } from '@/infra/cache/cache-repository'
import { RedisService } from '@/infra/cache/redis/redis.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RedisRepository implements ICacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.redis.client.set(key, value, {
      expiration: {
        type: 'EX',
        value: ttl ?? 60 * 5,
      },
    })
  }

  async get(key: string): Promise<string | null> {
    const cacheData = await this.redis.client.get(key)

    return cacheData
  }

  async delete(key: string): Promise<void> {
    await this.redis.client.del(key)
  }
}
