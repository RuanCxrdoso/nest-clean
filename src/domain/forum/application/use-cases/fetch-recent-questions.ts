import { right, type Either } from '@/core/either.js'
import type { Question } from '../../enterprise/entities/question.js'
import type { IQuestionRepository } from '../repositories/question-repository.js'

interface FetchRecentQuestionsRequest {
  page: number
}

type FetchRecentQuestionsResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })

    return right({ questions })
  }
}
