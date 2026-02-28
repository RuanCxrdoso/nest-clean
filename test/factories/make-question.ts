import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Question,
  type QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  const title = faker.lorem.sentence(3)

  const question = Question.create(
    {
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      slug: Slug.create(title),
      title,
      ...override,
    },
    id,
  )

  return question
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    override: Partial<QuestionProps> = {},
    id?: UniqueEntityId,
  ) {
    const question = makeQuestion(override, id)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    return question
  }
}
