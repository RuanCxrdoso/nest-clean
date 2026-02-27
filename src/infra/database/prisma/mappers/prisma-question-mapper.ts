import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion } from 'generated/prisma/client'
import { QuestionUncheckedCreateInput } from 'generated/prisma/models'

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

  static toPrisma(question: Question): QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId
        ? question.bestAnswerId.toString()
        : null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt ?? undefined,
    }
  }
}
