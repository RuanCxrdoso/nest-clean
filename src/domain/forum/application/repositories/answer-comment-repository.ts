import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface IAnswerCommentRepository {
  create: (answerComment: AnswerComment) => Promise<AnswerComment>
  delete: (answerComment: AnswerComment) => Promise<void>
  findById: (answerCommentId: string) => Promise<AnswerComment | null>
  findManyByAnswerId: (
    answerId: string,
    params: PaginationParams,
  ) => Promise<AnswerComment[]>
}
