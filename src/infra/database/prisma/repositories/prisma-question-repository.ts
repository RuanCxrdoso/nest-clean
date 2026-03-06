import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { IQuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { ICacheRepository } from '@/infra/cache/cache-repository'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import { QuestionWithDetailsMapper } from '@/infra/database/prisma/mappers/prisma-question-with-details-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionRepository implements IQuestionRepository {
  constructor(
    private prisma: PrismaService,
    private cache: ICacheRepository,
    private questionAttachmentRepository: IQuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.prisma.question.create({
      data,
    })

    const questionAttachmentList = question.attachments.getItems()

    await this.questionAttachmentRepository.createMany(questionAttachmentList)
  }

  async delete(question: Question): Promise<void> {
    // TODO: Delete all related answers, comments and attachments.
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    })

    await this.cache.delete(`question:${question.slug.value}:details`)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    const newAttachments = question.attachments.getNewItems()
    const removedAttachments = question.attachments.getRemovedItems()

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: question.id.toString(),
        },
        data,
      }),
      this.questionAttachmentRepository.createMany(newAttachments),
      this.questionAttachmentRepository.deleteMany(removedAttachments),
      this.cache.delete(`question:${question.slug.value}:details`),
    ])

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlugWithDetails(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cache.get(`question:${slug}:details`)

    // Se houver algo em cache, retorna imediatamente
    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)

      return cachedData
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!question) {
      throw new Error(`Question with slug '${slug}' not found.`)
    }

    const questionDetails = QuestionWithDetailsMapper.toDomain(question)

    // Armazena em cache no Redis
    await this.cache.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails),
      1000 * 60 * 5,
    )

    return questionDetails
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const itemsPerPage = 20
    const take = itemsPerPage
    const skip = (page - 1) * itemsPerPage

    const questionsRaw = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
    })

    const questions = questionsRaw.map((question) =>
      PrismaQuestionMapper.toDomain(question),
    )

    return questions
  }
}
