import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from '@/infra/http/http.module'
import { EventsModule } from '@/infra/events/events.module'

@Module({
  imports: [AuthModule, HttpModule, EventsModule],
})
export class AppModule {}
