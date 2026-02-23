import { AuthController } from '@/infra/http/controllers/auth.controller'
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller'
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller'
import { FetchRecentQuestionsController } from '@/infra/http/controllers/fetch-recent-questions.controller'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    AuthController,
  ],
  providers: [CreateQuestionUseCase],
})
export class HttpModule {}
