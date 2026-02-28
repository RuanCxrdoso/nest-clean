import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Comment } from 'generated/prisma/client'
import { CommentUncheckedCreateInput } from 'generated/prisma/models'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: Comment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid type.')
    }

    return AnswerComment.create(
      {
        answerId: new UniqueEntityId(raw.answerId),
        authorId: new UniqueEntityId(raw.authorId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(answerComment: AnswerComment): CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
