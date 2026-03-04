import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export abstract class IQuestionCommentRepository {
  abstract create: (
    questionComment: QuestionComment,
  ) => Promise<QuestionComment>

  abstract delete: (questionComment: QuestionComment) => Promise<void>

  abstract findById: (
    questionCommentId: string,
  ) => Promise<QuestionComment | null>
  // abstract findByIdWithAuthor(id: string): Promise<CommentWithAuthor>

  abstract findManyByQuestionId: (
    questionId: string,
    params: PaginationParams,
  ) => Promise<QuestionComment[]>
  abstract findManyByQuestionIdWithAuthor: (
    questionId: string,
    params: PaginationParams,
  ) => Promise<CommentWithAuthor[]>
}
