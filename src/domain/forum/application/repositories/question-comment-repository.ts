import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionComment } from '../../enterprise/entities/question-comment'

export abstract class IQuestionCommentRepository {
  abstract create: (
    questionComment: QuestionComment,
  ) => Promise<QuestionComment>
  abstract delete: (questionComment: QuestionComment) => Promise<void>
  abstract findById: (
    questionCommentId: string,
  ) => Promise<QuestionComment | null>
  abstract findManyByQuestionId: (
    questionId: string,
    params: PaginationParams,
  ) => Promise<QuestionComment[]>
}
