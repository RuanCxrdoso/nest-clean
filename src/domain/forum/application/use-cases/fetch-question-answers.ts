import { right, type Either } from '@/core/either'
import type { Answer } from '../../enterprise/entities/answer'
import { IAnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersUseCaseRequest {
  page: number
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchQuestionAnswersUseCase {
  constructor(private answerRepository: IAnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answerRepository.findManyByAnswerId({
      page,
      id: questionId,
    })

    return right({
      answers,
    })
  }
}
