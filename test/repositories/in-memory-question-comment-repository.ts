import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { IQuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

export class InMemoryQuestionCommentRepository implements IQuestionCommentRepository {
  public questionComments: QuestionComment[] = []

  constructor(private studentReposity: InMemoryStudentRepository) {}

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

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionCommentsWithAuthor = this.questionComments
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const commentAuthor = this.studentReposity.items.find((user) =>
          user.id.equals(comment.authorId),
        )

        if (!commentAuthor) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()} does not exist."`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id.toString(),
          content: comment.content,
          authorId: commentAuthor.id.toString(),
          author: commentAuthor.name,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })
      })

    return questionCommentsWithAuthor
  }
}
