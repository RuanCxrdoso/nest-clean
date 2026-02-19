import { right, type Either } from '@/core/either.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import { Answer } from '../../enterprise/entities/answer.js'
import type { IAnswersRepository } from '../repositories/answers-repository.js'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment.js'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list.js'

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
