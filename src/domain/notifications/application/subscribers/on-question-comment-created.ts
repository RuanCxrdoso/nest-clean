import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import { IQuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event'
import type { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionRepository: IQuestionRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    void this.setupSubscriptions()
  }

  public setupSubscriptions() {
    DomainEvents.register(
      this.questionCommentCreatedSendNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    )
  }

  private async questionCommentCreatedSendNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Um novo comentário foi adicionado à sua pergunta ${question.title.substring(0, 40).concat('...')}`,
        content: `Novo comentário: ${questionComment.content.substring(0, 200).concat('...')}`,
      })
    }
  }
}
