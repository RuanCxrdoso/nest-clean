import type { DomainEvent } from '@/core/events/domain-event.js'
import type { Question } from '../entities/question.js'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.js'

export class BestQuestionAnswerChooseEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityId

  constructor(question: Question, bestAnswerId: UniqueEntityId) {
    this.ocurredAt = new Date()
    this.question = question
    this.bestAnswerId = bestAnswerId
  }

  public getAggregateId() {
    return this.question.id
  }
}
