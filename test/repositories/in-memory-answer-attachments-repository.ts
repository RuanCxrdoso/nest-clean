import type { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository implements IAnswerAttachmentsRepository {
  public answerAttachments: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.answerAttachments.filter(
      (item) => item.answerId.toString() === answerId,
    )

    return answerAttachments
  }

  async deleteManyByAnswerId(answerId: string) {
    this.answerAttachments = this.answerAttachments.filter(
      (item) => item.answerId.toString() !== answerId,
    )

    return
  }

  async createMany(attachments: AnswerAttachment[]) {
    this.answerAttachments.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]) {
    this.answerAttachments = this.answerAttachments.filter((item) => {
      return !attachments.some(
        (attachment) => attachment.id.toString() === item.id.toString(),
      )
    })
  }
}
