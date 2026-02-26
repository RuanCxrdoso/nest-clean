import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Question } from '../../enterprise/entities/question'

export abstract class IQuestionRepository {
  abstract create: (question: Question) => Promise<void>
  abstract delete: (question: Question) => Promise<void>
  abstract save: (question: Question) => Promise<void>
  abstract findBySlug: (slug: string) => Promise<Question | null>
  abstract findById: (id: string) => Promise<Question | null>
  abstract findManyRecent: ({ page }: PaginationParams) => Promise<Question[]>
}
