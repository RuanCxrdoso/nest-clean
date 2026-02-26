import { beforeEach, describe, expect, it } from 'vitest'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { InMemoryAnswerCommentRepository } from '../../../../../test/repositories/in-memory-answer-comment-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment'

let answerCommentsRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments use-case test', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const fakeAnswer = makeAnswer()

    const fakeAnswerComment1 = makeAnswerComment({
      answerId: fakeAnswer.id,
    })

    const fakeAnswerComment2 = makeAnswerComment({
      answerId: fakeAnswer.id,
    })

    const fakeAnswerComment3 = makeAnswerComment({
      answerId: fakeAnswer.id,
    })

    await answerCommentsRepository.create(fakeAnswerComment1)
    await answerCommentsRepository.create(fakeAnswerComment2)
    await answerCommentsRepository.create(fakeAnswerComment3)

    await sut.execute({
      answerId: fakeAnswer.id.toString(),
      page: 1,
    })

    expect(answerCommentsRepository.answerComments).toHaveLength(3)
    expect(answerCommentsRepository.answerComments).toEqual([
      expect.objectContaining({ answerId: fakeAnswer.id }),
      expect.objectContaining({ answerId: fakeAnswer.id }),
      expect.objectContaining({ answerId: fakeAnswer.id }),
    ])
  })

  it('should be able to paginate fetch answer comments', async () => {
    const fakeAnswer = makeAnswer()

    for (let i = 1; i <= 22; i++) {
      const fakeAnswerComment = makeAnswerComment({
        answerId: fakeAnswer.id,
      })

      await answerCommentsRepository.create(fakeAnswerComment)
    }

    const firstAnswerCommentsPage = await sut.execute({
      answerId: fakeAnswer.id.toString(),
      page: 1,
    })
    const secondAnswerCommentsPage = await sut.execute({
      answerId: fakeAnswer.id.toString(),
      page: 2,
    })

    expect(firstAnswerCommentsPage.value?.answerComments).toHaveLength(20)
    expect(secondAnswerCommentsPage.value?.answerComments).toHaveLength(2)
  })
})
