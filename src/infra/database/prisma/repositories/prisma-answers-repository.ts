import {
  FindManyByAnswerIdProps,
  IAnswersRepository,
} from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswersRepository implements IAnswersRepository {
  constructor(private prisma: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({
      data,
    })
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.update({
      data,
      where: {
        id: answer.id.toString(),
      },
    })
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    })
  }

  async findById(answerId: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id: answerId,
      },
    })

    if (!answer) return null

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByAnswerId({
    id,
    page,
  }: FindManyByAnswerIdProps): Promise<Answer[]> {
    const itemsPerPage = 20
    const take = itemsPerPage
    const skip = (page - 1) * take

    const answersResult = await this.prisma.answer.findMany({
      where: {
        id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
    })

    return answersResult.map(PrismaAnswerMapper.toDomain)
  }
}
