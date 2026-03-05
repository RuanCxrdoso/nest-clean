import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export abstract class IQuestionRepository {
  abstract create: (question: Question) => Promise<void>
  abstract delete: (question: Question) => Promise<void>
  abstract save: (question: Question) => Promise<void>
  abstract findBySlug: (slug: string) => Promise<Question | null>
  abstract findBySlugWithDetails: (
    slug: string,
  ) => Promise<QuestionDetails | null>
  abstract findById: (id: string) => Promise<Question | null>
  abstract findManyRecent: ({ page }: PaginationParams) => Promise<Question[]>
}
