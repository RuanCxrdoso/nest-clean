import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Answer } from '../../enterprise/entities/answer'

export interface FindManyByAnswerIdProps extends PaginationParams {
  id: string
}

export abstract class IAnswersRepository {
  abstract create: (answer: Answer) => Promise<void>
  abstract save: (answer: Answer) => Promise<void>
  abstract delete: (answer: Answer) => Promise<void>
  abstract findById: (answerId: string) => Promise<Answer | null>
  abstract findManyByAnswerId: ({
    id,
    page,
  }: FindManyByAnswerIdProps) => Promise<Answer[]>
}
