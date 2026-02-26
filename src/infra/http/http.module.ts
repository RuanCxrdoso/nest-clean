import { AuthController } from '@/infra/http/controllers/auth.controller'
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller'
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller'
import { FetchRecentQuestionsController } from '@/infra/http/controllers/fetch-recent-questions.controller'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { AuthStudentUseCase } from '@/domain/forum/application/use-cases/auth-student'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { CreateStudentUseCase } from '@/domain/forum/application/use-cases/create-student'
import { FindQuestionBySlugController } from '@/infra/http/controllers/find-question-by-slug.controller'
import { FindQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/find-question-by-slug'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    CreateQuestionController,
    FindQuestionBySlugController,
    FetchRecentQuestionsController,
    AuthController,
  ],
  providers: [
    CreateStudentUseCase,
    CreateQuestionUseCase,
    FindQuestionBySlugUseCase,
    FetchRecentQuestionsUseCase,
    AuthStudentUseCase,
  ],
})
export class HttpModule {}
