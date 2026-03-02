import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import type { IQuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionRepository implements IQuestionRepository {
  public questions: Question[] = []

  constructor(
    private questionAttachmentsRepository: IQuestionAttachmentsRepository,
  ) {}

  async create(question: Question) {
    this.questions.push(question)

    const questionAttachmentsList = question.attachments.getItems()

    if (questionAttachmentsList.length >= 1) {
      this.questionAttachmentsRepository.createMany(questionAttachmentsList)
    }
  }

  async delete(question: Question) {
    this.questions = this.questions.filter(
      (questionItem) => questionItem.id !== question.id,
    )

    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async save(question: Question) {
    const questionIndex = this.questions.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    )

    this.questions[questionIndex] = question

    const newAttachments = question.attachments.getNewItems()
    const removedAttachments = question.attachments.getRemovedItems()

    await this.questionAttachmentsRepository.createMany(newAttachments)
    await this.questionAttachmentsRepository.deleteMany(removedAttachments)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string) {
    const question = this.questions.find(
      (question) => question.slug.value === slug,
    )

    if (!question) return null

    return question
  }

  async findById(id: string) {
    const question = this.questions.find(
      (question) => question.id.toString() === id,
    )

    if (!question) return null

    return question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.questions
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice((page - 1) * 20, page * 20)

    return questions
  }
}
