import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion } from 'generated/prisma/client'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    const question = Question.create(
      {
        slug: Slug.create(raw.slug),
        title: raw.title,
        content: raw.content,
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityId(raw.bestAnswerId)
          : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        authorId: new UniqueEntityId(raw.authorId),
      },
      new UniqueEntityId(raw.id),
    )

    return question
  }
}
