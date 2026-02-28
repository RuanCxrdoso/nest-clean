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
import { UpdateQuestionController } from '@/infra/http/controllers/update-question.controller'
import { UpdateQuestionUseCase } from '@/domain/forum/application/use-cases/update-question'
import { DeleteQuestionController } from '@/infra/http/controllers/delete-question.controller'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { AnswerQuestionController } from '@/infra/http/controllers/answer-question.controller'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { UpdateAnswerController } from '@/infra/http/controllers/update-answer.controller'
import { UpdateAnswerUseCase } from '@/domain/forum/application/use-cases/update-answer'
import { DeleteAnswerController } from '@/infra/http/controllers/delete-answer.controller'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { FetchQuestionAnswersController } from '@/infra/http/controllers/fetch-question-answers.controller'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { ChooseQuestionBestAnswerController } from '@/infra/http/controllers/choose-question-best-answer.controller'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CommentOnQuestionController } from '@/infra/http/controllers/comment-on-question.controller'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { DeleteQuestionCommentController } from '@/infra/http/controllers/delete-question-comment.controller'
import { CommentOnAnswerController } from '@/infra/http/controllers/comment-on-answer.controller'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { DeleteAnswerCommentController } from '@/infra/http/controllers/delete-answer-comment.controller'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { FetchQuestionCommentsController } from '@/infra/http/controllers/fetch-question-comments.controller'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { FetchAnswerCommentsController } from '@/infra/http/controllers/fetch-answer-comments.controller'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    CreateQuestionController,
    FindQuestionBySlugController,
    FetchRecentQuestionsController,
    AuthController,
    UpdateQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    UpdateAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
  ],
  providers: [
    CreateStudentUseCase,
    CreateQuestionUseCase,
    FindQuestionBySlugUseCase,
    FetchRecentQuestionsUseCase,
    AuthStudentUseCase,
    UpdateQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    UpdateAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
  ],
})
export class HttpModule {}
