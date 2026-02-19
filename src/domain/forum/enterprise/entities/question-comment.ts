import { Comment, type CommentProps } from '@/core/entities/comment.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import type { Optional } from '@/core/types/optional.js'
import { QuestionCommentCreatedEvent } from '../events/question-comment-created-event.js'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    if (!id) {
      const questionCommentCreatedEvent = new QuestionCommentCreatedEvent(
        questionComment,
      )

      questionComment.addDomainEvent(questionCommentCreatedEvent)
    }

    return questionComment
  }

  get questionId() {
    return this.props.questionId
  }
}
