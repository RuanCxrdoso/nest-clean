import { ICacheRepository } from '@/infra/cache/cache-repository'
import { RedisRepository } from '@/infra/cache/redis/redis-repository'
import { RedisService } from '@/infra/cache/redis/redis.service'
import { EnvModule } from '@/infra/env/env.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    {
      provide: ICacheRepository,
      useClass: RedisRepository,
    },
  ],
  exports: [RedisService, ICacheRepository],
})
export class CacheModule {}
