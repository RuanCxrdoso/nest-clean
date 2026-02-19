import { beforeEach, describe, expect, it } from 'vitest'
import { makeQuestion } from '../../../../../test/factories/make-question.js'
import { InMemoryQuestionCommentRepository } from '../../../../../test/repositories/in-memory-question-comment-repository.js'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments.js'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment.js'

let questionCommentsRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments use-case test', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentRepository()
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const fakeQuestion = makeQuestion()

    const fakeQuestionComment1 = makeQuestionComment({
      questionId: fakeQuestion.id,
    })

    const fakeQuestionComment2 = makeQuestionComment({
      questionId: fakeQuestion.id,
    })

    const fakeQuestionComment3 = makeQuestionComment({
      questionId: fakeQuestion.id,
    })

    await questionCommentsRepository.create(fakeQuestionComment1)
    await questionCommentsRepository.create(fakeQuestionComment2)
    await questionCommentsRepository.create(fakeQuestionComment3)

    const questionComments = await sut.execute({
      questionId: fakeQuestion.id.toString(),
      page: 1,
    })

    expect(questionComments.value?.questionComments).toHaveLength(3)
    expect(questionComments.value?.questionComments).toEqual([
      expect.objectContaining({ questionId: fakeQuestion.id }),
      expect.objectContaining({ questionId: fakeQuestion.id }),
      expect.objectContaining({ questionId: fakeQuestion.id }),
    ])
  })

  it('should be able to paginate fetch question comments', async () => {
    const fakeQuestion = makeQuestion()

    for (let i = 1; i <= 22; i++) {
      const fakeQuestionComment = makeQuestionComment({
        questionId: fakeQuestion.id,
      })

      await questionCommentsRepository.create(fakeQuestionComment)
    }

    const firstQuestionCommentsPage = await sut.execute({
      questionId: fakeQuestion.id.toString(),
      page: 1,
    })
    const secondQuestionCommentsPage = await sut.execute({
      questionId: fakeQuestion.id.toString(),
      page: 2,
    })

    expect(firstQuestionCommentsPage.value?.questionComments).toHaveLength(20)
    expect(secondQuestionCommentsPage.value?.questionComments).toHaveLength(2)
  })
})
