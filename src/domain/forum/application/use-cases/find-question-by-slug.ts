import { left, right, type Either } from '@/core/either.js'
import type { Question } from '../../enterprise/entities/question.js'
import type { IQuestionRepository } from '../repositories/question-repository.js'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.js'

interface GetQuestionBySlugRequest {
  slug: string
}

type GetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionRepository.findBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
