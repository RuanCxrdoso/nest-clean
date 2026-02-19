import { Comment, type CommentProps } from '@/core/entities/comment.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import type { Optional } from '@/core/types/optional.js'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get answerId(): UniqueEntityId {
    return this.props.answerId
  }
}
