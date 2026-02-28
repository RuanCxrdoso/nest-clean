import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Attachment } from 'generated/prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: Attachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type.')
    }

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityId(raw.answerId),
        attachmentId: new UniqueEntityId(raw.id),
      },
      new UniqueEntityId(raw.id),
    )
  }
}
