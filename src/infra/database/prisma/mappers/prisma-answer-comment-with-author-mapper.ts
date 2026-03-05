import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Comment, User } from 'generated/prisma/client'

type PrismaAnswerCommentWithAuthor = Comment & {
  author: User
}

export class PrismaAnswerCommentWithAuthorMapper {
  static toDomain(raw: PrismaAnswerCommentWithAuthor) {
    return CommentWithAuthor.create({
      commentId: raw.id,
      content: raw.content,
      author: raw.author.name,
      authorId: raw.author.id,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
