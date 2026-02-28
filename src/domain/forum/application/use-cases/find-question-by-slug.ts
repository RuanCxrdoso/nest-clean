import { left, right, type Either } from '@/core/either'
import type { Question } from '../../enterprise/entities/question'
import { IQuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface GetQuestionBySlugRequest {
  slug: string
}

type GetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

@Injectable()
export class FindQuestionBySlugUseCase {
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
