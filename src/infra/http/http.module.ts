import { AuthController } from '@/infra/http/controllers/auth.controller'
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller'
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller'
import { FetchRecentQuestionsController } from '@/infra/http/controllers/fetch-recent-questions.controller'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { Module } from '@nestjs/common'

@Module({
  controllers: [
    CreateAccountController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    AuthController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
