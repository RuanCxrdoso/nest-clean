import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Answer } from '../../enterprise/entities/answer'

export interface FindManyByAnswerIdProps extends PaginationParams {
  id: string
}

export interface IAnswersRepository {
  create: (answer: Answer) => Promise<void>
  save: (answer: Answer) => Promise<void>
  delete: (answer: Answer) => Promise<void>
  findById: (answerId: string) => Promise<Answer | null>
  findManyByAnswerId: ({
    id,
    page,
  }: FindManyByAnswerIdProps) => Promise<Answer[]>
}
