import { right, type Either } from '@/core/either'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'
import type { IAnswerCommentRepository } from '../repositories/answer-comment-repository'

interface FetchAnswerCommentsUseCaseRequest {
  page: number
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentRepository: IAnswerCommentRepository) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentRepository.findManyByAnswerId(answerId, {
        page,
      })

    return right({
      answerComments,
    })
  }
}
