import { right, type Either } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import type { IAnswersRepository } from '../repositories/answers-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseRequest {
  instructorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: instructorId,
      questionId: questionId,
    })

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityId(attachmentId),
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
