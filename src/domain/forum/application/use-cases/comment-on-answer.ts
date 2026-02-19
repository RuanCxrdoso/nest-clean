import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import { AnswerComment } from '../../enterprise/entities/answer-comment.js'
import type { IAnswerCommentRepository } from '../repositories/answer-comment-repository.js'
import type { IAnswersRepository } from '../repositories/answers-repository.js'
import { left, right, type Either } from '@/core/either.js'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.js'

interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

export class CommentOnAnswerUseCase {
  constructor(
    private answerCommentRepository: IAnswerCommentRepository,
    private answerRepository: IAnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    })

    await this.answerCommentRepository.create(answerComment)

    return right({ answerComment })
  }
}
