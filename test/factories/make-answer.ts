import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Answer,
  type AnswerProps,
} from '@/domain/forum/enterprise/entities/answer'
import { faker } from '@faker-js/faker'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
) {
  const answer = Answer.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return answer
}
