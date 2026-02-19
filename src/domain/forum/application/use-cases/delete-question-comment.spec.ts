import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryQuestionCommentRepository } from '../../../../../test/repositories/in-memory-question-comment-repository.js'
import { DeleteQuestionCommentUseCase } from './delete-question-comment.js'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import { NotAllowedError } from '@/core/errors/not-allowed-error.js'

let questionCommentRespository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment use case tests', () => {
  beforeEach(() => {
    questionCommentRespository = new InMemoryQuestionCommentRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentRespository)
  })

  it('should be able to delete a comment on a question', async () => {
    const newQuestionComment = makeQuestionComment()

    await questionCommentRespository.create(newQuestionComment)

    await sut.execute({
      authorId: newQuestionComment.authorId.toString(),
      questionCommentId: newQuestionComment.id.toString(),
    })

    expect(questionCommentRespository.questionComments).toHaveLength(0)
  })

  it('shouldnt be able to delete a comment from another user', async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await questionCommentRespository.create(newQuestionComment)

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: newQuestionComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
