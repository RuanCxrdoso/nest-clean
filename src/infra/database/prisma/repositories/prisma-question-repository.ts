import { PaginationParams } from '@/core/repositories/pagination-params'
import { IQuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionRepository implements IQuestionRepository {
  constructor(private prisma: PrismaService) {}

  async create(question: Question): Promise<void> {
    // TODO: If exists, create all related attachments.
    await this.prisma.question.create({
      data: {
        id: question.id.toString(),
        authorId: question.authorId.toString(),
        title: question.title,
        content: question.content,
        slug: question.slug.value,
      },
    })
  }

  async delete(question: Question): Promise<void> {
    // TODO: Delete all related answers, comments and attachments.
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    })
  }

  async save(question: Question): Promise<void> {
    await this.prisma.question.update({
      where: {
        id: question.id.toString(),
      },
      data: {
        authorId: question.authorId.toString(),
        title: question.title,
        content: question.content,
        slug: question.slug.value,
      },
    })
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
