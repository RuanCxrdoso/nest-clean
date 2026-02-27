import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class IAnswerCommentRepository {
  abstract create: (answerComment: AnswerComment) => Promise<AnswerComment>
  abstract delete: (answerComment: AnswerComment) => Promise<void>
  abstract findById: (answerCommentId: string) => Promise<AnswerComment | null>
  abstract findManyByAnswerId: (
    answerId: string,
    params: PaginationParams,
  ) => Promise<AnswerComment[]>
}
