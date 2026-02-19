import type { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository.js'
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.js'

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
}
