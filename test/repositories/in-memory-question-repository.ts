import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { IQuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

export class InMemoryQuestionRepository implements IQuestionRepository {
  public questions: Question[] = []

  constructor(
    private studentRepository: InMemoryStudentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
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

  async findBySlugWithDetails(slug: string) {
    const question = this.questions.find(
      (question) => question.slug.value === slug,
    )

    if (!question) return null

    const questionAuthor = this.studentRepository.items.find((student) =>
      student.id.equals(question.authorId),
    )

    if (!questionAuthor) return null

    const questionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(
        question.id.toString(),
      )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((item) =>
        item.id.equals(questionAttachment.attachmentId),
      )

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: questionAuthor.id,
      author: questionAuthor.name,
      title: question.title,
      content: question.content,
      slug: question.slug,
      attachments,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
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
