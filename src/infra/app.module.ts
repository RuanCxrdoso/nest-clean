import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from '@/infra/http/http.module'

@Module({
  imports: [AuthModule, HttpModule],
})
export class AppModule {}
