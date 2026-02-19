import { Entities } from '@/core/entities/entities.js'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.js'

export interface AnswerAttachmentProps {
  answerId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class AnswerAttachment extends Entities<AnswerAttachmentProps> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityId) {
    const answerAttachment = new AnswerAttachment(props, id)

    return answerAttachment
  }
}
