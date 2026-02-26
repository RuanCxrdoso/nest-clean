import { left, right, type Either } from '@/core/either'
import type { Question } from '../../enterprise/entities/question'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { IQuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { IQuestionRepository } from '../repositories/question-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface UpdateQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type UpdateQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class UpdateQuestionUseCase {
  constructor(
    private questionRepository: IQuestionRepository,
    private questionAttachmentRepository: IQuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: UpdateQuestionUseCaseRequest): Promise<UpdateQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    // Busco os anexos atuais
    const currentQuestionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId)

    // Crio a watched list passando os anexos atuais como currentItems
    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    // Crio um novo array de questionAttachments com os novos attachments enviados pelo usuario e salvo o que preciso ser criado e o que precisa ser deletado na watched list
    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueEntityId(attachmentId),
      })
    })

    // Envio para a watched list realizar a comparação entre os attachments atuais e os novos
    questionAttachmentList.update(questionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionRepository.save(question)

    return right({
      question,
    })
  }
}
