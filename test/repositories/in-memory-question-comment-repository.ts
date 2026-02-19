import { DomainEvents } from '@/core/events/domain-events.js'
import type { PaginationParams } from '@/core/repositories/pagination-params.js'
import type { IQuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository.js'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.js'

export class InMemoryQuestionCommentRepository implements IQuestionCommentRepository {
  public questionComments: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.questionComments.push(questionComment)

    DomainEvents.dispatchEventsForAggregate(questionComment.id)

    return questionComment
  }

  async delete(questionComment: QuestionComment) {
    const questionCommentIndex = this.questionComments.findIndex(
      (item) => item.id.toString() === questionComment.id.toString(),
    )

    this.questionComments.splice(questionCommentIndex, 1)

    return
  }

  async findById(questionCommentId: string) {
    const questionComment = this.questionComments.find(
      (item) => item.id.toString() === questionCommentId,
    )

    if (!questionComment) return null

    return questionComment
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.questionComments
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }
}
