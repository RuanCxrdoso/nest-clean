import type { DomainEvent } from '@/core/events/domain-event.js'
import type { QuestionComment } from '../entities/question-comment.js'

export class QuestionCommentCreatedEvent implements DomainEvent {
  ocurredAt: Date
  questionComment: QuestionComment

  constructor(questionComment: QuestionComment) {
    this.ocurredAt = new Date()
    this.questionComment = questionComment
  }

  public getAggregateId() {
    return this.questionComment.id
  }
}
