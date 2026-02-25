import { right, type Either } from '@/core/either'
import type { Question } from '../../enterprise/entities/question'
import type { IQuestionRepository } from '../repositories/question-repository'
import { Injectable } from '@nestjs/common'

interface FetchRecentQuestionsRequest {
  page: number
}

type FetchRecentQuestionsResponse = Either<
  null,
  {
    questions: Question[]
  }
>

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })

    return right({ questions })
  }
}
