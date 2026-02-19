import type { PaginationParams } from '@/core/repositories/pagination-params.js'
import type { Answer } from '../../enterprise/entities/answer.js'

export interface FindManyByQuestionIdProps extends PaginationParams {
  id: string
}

export interface IAnswersRepository {
  create: (answer: Answer) => Promise<void>
  save: (answer: Answer) => Promise<void>
  delete: (answer: Answer) => Promise<void>
  findById: (answerId: string) => Promise<Answer | null>
  findManyByQuestionId: ({
    id,
    page,
  }: FindManyByQuestionIdProps) => Promise<Answer[]>
}
