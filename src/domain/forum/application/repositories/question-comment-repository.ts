import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionComment } from '../../enterprise/entities/question-comment'

export interface IQuestionCommentRepository {
  create: (questionComment: QuestionComment) => Promise<QuestionComment>
  delete: (questionComment: QuestionComment) => Promise<void>
  findById: (questionCommentId: string) => Promise<QuestionComment | null>
  findManyByQuestionId: (
    questionId: string,
    params: PaginationParams,
  ) => Promise<QuestionComment[]>
}
