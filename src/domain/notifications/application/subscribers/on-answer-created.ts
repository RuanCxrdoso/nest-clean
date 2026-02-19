import { DomainEvents } from '@/core/events/domain-events.js'
import type { EventHandler } from '@/core/events/event-handler.js'
import type { IQuestionRepository } from '@/domain/forum/application/repositories/question-repository.js'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event.js'
import type { SendNotificationUseCase } from '../use-cases/send-notification.js'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionRepository: IQuestionRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendCreatedNewAnswerEventNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendCreatedNewAnswerEventNotification({
    answer,
  }: AnswerCreatedEvent) {
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em ${question.title.substring(0, 40).concat('...')}`,
        content: `${answer.excerpt}`,
      })
    }
  }
}
