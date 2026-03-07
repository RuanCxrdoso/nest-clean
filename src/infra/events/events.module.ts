import { OnAnswerCreated } from '@/domain/notifications/application/subscribers/on-answer-created'
import { OnQuestionBestAnswerChoose } from '@/domain/notifications/application/subscribers/on-question-best-answer-choose'
import { OnQuestionCommentCreated } from '@/domain/notifications/application/subscribers/on-question-comment-created'
import { ReadNotificationUseCase } from '@/domain/notifications/application/use-cases/read-notification'
import { SendNotificationUseCase } from '@/domain/notifications/application/use-cases/send-notification'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnQuestionBestAnswerChoose,
    OnAnswerCreated,
    OnQuestionCommentCreated,
    ReadNotificationUseCase,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
