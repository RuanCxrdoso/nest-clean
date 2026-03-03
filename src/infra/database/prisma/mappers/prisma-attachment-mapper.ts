import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import {
  AttachmentUncheckedCreateInput,
  AttachmentUpdateManyArgs,
} from 'generated/prisma/models'

export class PrismaAttachmentMapper {
  static toPrisma(attachment: Attachment): AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }

  static toPrismaUpdateMany(
    attachments: AnswerAttachment[],
  ): AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        answerId: attachments[0].answerId.toString(),
      },
    }
  }
}
