import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import type { IQuestionRepository } from '../repositories/question-repository.js'
import { QuestionComment } from '../../enterprise/entities/question-comment.js'
import type { IQuestionCommentRepository } from '../repositories/question-comment-repository.js'
import { left, right, type Either } from '@/core/either.js'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.js'

interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionUseCase {
  constructor(
    private questionCommentRepository: IQuestionCommentRepository,
    private questionRepository: IQuestionRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    await this.questionCommentRepository.create(questionComment)

    return right({ questionComment })
  }
}
