import type { QuestionAttachment } from '../../enterprise/entities/question-attachment.js'

export interface IQuestionAttachmentsRepository {
  findManyByQuestionId: (questionId: string) => Promise<QuestionAttachment[]>
  deleteManyByQuestionId: (questionId: string) => Promise<void>
}
