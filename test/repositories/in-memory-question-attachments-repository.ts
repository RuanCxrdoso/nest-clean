import type { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository implements IQuestionAttachmentsRepository {
  public questionAttachments: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.questionAttachments.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    this.questionAttachments = this.questionAttachments.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    return
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.questionAttachments.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const newQuestionAttachmentsList = this.questionAttachments.filter(
      (item) => !attachments.some((attachment) => attachment.equals(item)),
    )

    this.questionAttachments = newQuestionAttachmentsList
  }
}
