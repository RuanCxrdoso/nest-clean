import type { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export abstract class IQuestionAttachmentsRepository {
  abstract findManyByQuestionId: (
    questionId: string,
  ) => Promise<QuestionAttachment[]>
  abstract deleteManyByQuestionId: (questionId: string) => Promise<void>
}
