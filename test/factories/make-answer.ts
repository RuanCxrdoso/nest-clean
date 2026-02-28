import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Answer,
  type AnswerProps,
} from '@/domain/forum/enterprise/entities/answer'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
) {
  const answer = Answer.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityId().toString(),
      questionId: new UniqueEntityId().toString(),
      ...override,
    },
    id,
  )

  return answer
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(
    override: Partial<AnswerProps> = {},
    id?: UniqueEntityId,
  ) {
    const answer = makeAnswer(override, id)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    })

    return answer
  }
}
