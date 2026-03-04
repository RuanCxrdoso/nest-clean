import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export abstract class IAnswerCommentRepository {
  abstract create: (answerComment: AnswerComment) => Promise<AnswerComment>
  abstract delete: (answerComment: AnswerComment) => Promise<void>
  abstract findById: (answerCommentId: string) => Promise<AnswerComment | null>
  abstract findManyByAnswerId: (
    answerId: string,
    params: PaginationParams,
  ) => Promise<AnswerComment[]>
  abstract findManyByAnswerIdWithAuthor: (
    answerId: string,
    params: PaginationParams,
  ) => Promise<CommentWithAuthor[]>
}
