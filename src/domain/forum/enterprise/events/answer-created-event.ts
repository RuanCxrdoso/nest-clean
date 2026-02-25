import type { DomainEvent } from '@/core/events/domain-event'
import type { Answer } from '../entities/answer'

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answer: Answer

  public constructor(answer: Answer) {
    this.answer = answer
    this.ocurredAt = new Date()
  }

  public getAggregateId() {
    return this.answer.id
  }
}
