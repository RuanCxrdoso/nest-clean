import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import type { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { BestQuestionAnswerChooseEvent } from '@/domain/forum/enterprise/events/best-question-answer-choose-event'
import type { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionBestAnswerChoose implements EventHandler {
  constructor(
    private answersRepository: IAnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  public setupSubscriptions() {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      BestQuestionAnswerChooseEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: BestQuestionAnswerChooseEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida como favorita :)`,
        content: `Sua resposta ${answer.content.substring(0, 80)} feita na pergunta '${question.title.substring(0, 50)}' foi definida como a melhor de todas!`,
      })
    }
  }
}
