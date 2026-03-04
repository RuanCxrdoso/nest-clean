import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHTTP(comment: CommentWithAuthor) {
    const { commentId, content, authorId, author, createdAt, updatedAt } =
      comment

    return {
      commentId,
      content,
      authorId,
      author,
      createdAt,
      updatedAt,
    }
  }
}
