import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAnswerCommentRepository } from '../../../../../test/repositories/in-memory-answer-comment-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let answerCommentRespository: InMemoryAnswerCommentRepository
let studentRepository: InMemoryStudentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete answer comment use case tests', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    answerCommentRespository = new InMemoryAnswerCommentRepository(
      studentRepository,
    )
    sut = new DeleteAnswerCommentUseCase(answerCommentRespository)
  })

  it('should be able to delete a comment on a answer', async () => {
    const newAnswerComment = makeAnswerComment()

    await answerCommentRespository.create(newAnswerComment)

    await sut.execute({
      authorId: newAnswerComment.authorId.toString(),
      answerCommentId: newAnswerComment.id.toString(),
    })

    expect(answerCommentRespository.answerComments).toHaveLength(0)
  })

  it('shouldnt be able to delete a comment from another user', async () => {
    const newAnswerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await answerCommentRespository.create(newAnswerComment)

    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId: newAnswerComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
