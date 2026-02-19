import { left, right, type Either } from '@/core/either.js'
import type { Answer } from '../../enterprise/entities/answer.js'
import type { IAnswersRepository } from '../repositories/answers-repository.js'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.js'
import { NotAllowedError } from '@/core/errors/not-allowed-error.js'
import type { IAnswerAttachmentsRepository } from '../repositories/answer-attachments-repository.js'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list.js'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'

interface UpdateAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type UpdateAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class UpdateAnswerUseCase {
  constructor(
    private answerRepository: IAnswersRepository,
    private answerAttachmentRepository: IAnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: UpdateAnswerUseCaseRequest): Promise<UpdateAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    // Busco os anexos atuais
    const currentAnswerAttachments =
      await this.answerAttachmentRepository.findManyByAnswerId(answerId)

    // Crio a watched list passando os anexos atuais como currentItems
    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    // Crio um novo array de answerAttachments com os novos attachments enviados pelo usuario e salvo o que preciso ser criado e o que precisa ser deletado na watched list
    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityId(attachmentId),
      })
    })

    // Envio para a watched list realizar a comparação entre os attachments atuais e os novos
    answerAttachmentList.update(answerAttachments)

    answer.attachments = answerAttachmentList

    answer.content = content

    await this.answerRepository.save(answer)

    return right({
      answer,
    })
  }
}
