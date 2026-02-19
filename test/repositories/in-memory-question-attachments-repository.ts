import type { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository.js'
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.js'

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
}
