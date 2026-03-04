import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Comment, User } from 'generated/prisma/client'

type PrismaQuestionCommentWithAuthor = Comment & {
  author: User
}

export class QuestionCommentWithAuthorMapper {
  static toDomain(raw: PrismaQuestionCommentWithAuthor) {
    const questionCommentWithAuthor = CommentWithAuthor.create({
      commentId: raw.id,
      content: raw.content,
      author: raw.author.name,
      authorId: raw.authorId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })

    return questionCommentWithAuthor
  }
}
