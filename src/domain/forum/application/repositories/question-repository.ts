import type { PaginationParams } from '@/core/repositories/pagination-params.js'
import type { Question } from '../../enterprise/entities/question.js'

export interface IQuestionRepository {
  create: (question: Question) => Promise<Question>
  delete: (question: Question) => Promise<void>
  save: (question: Question) => Promise<void>
  findBySlug: (slug: string) => Promise<Question | null>
  findById: (id: string) => Promise<Question | null>
  findManyRecent: ({ page }: PaginationParams) => Promise<Question[]>
}
