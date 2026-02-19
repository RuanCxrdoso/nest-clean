import { beforeEach, describe, expect, it } from 'vitest'
import { makeAnswer } from '../../../../../test/factories/make-answer.js'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository.js'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers.js'
import { makeQuestion } from '../../../../../test/factories/make-question.js'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository.js'

let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let answerRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch question answers use-case test', () => {
  beforeEach(() => {
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(answerAttachmentRepository)
    sut = new FetchQuestionAnswersUseCase(answerRepository)
  })

  it('should be able to fetch question answers', async () => {
    const fakeQuestion = makeQuestion()

    const fakeAnswer1 = makeAnswer({
      questionId: fakeQuestion.id,
    })

    const fakeAnswer2 = makeAnswer({
      questionId: fakeQuestion.id,
    })

    const fakeAnswer3 = makeAnswer({
      questionId: fakeQuestion.id,
    })

    await answerRepository.create(fakeAnswer1)
    await answerRepository.create(fakeAnswer2)
    await answerRepository.create(fakeAnswer3)

    const result = await sut.execute({
      questionId: fakeQuestion.id.toString(),
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(3)
    expect(result.value?.answers).toEqual([
      expect.objectContaining({ questionId: fakeQuestion.id }),
      expect.objectContaining({ questionId: fakeQuestion.id }),
      expect.objectContaining({ questionId: fakeQuestion.id }),
    ])
  })

  it('should be able to paginate fetch recents answers', async () => {
    const fakeQuestion = makeQuestion()

    for (let i = 1; i <= 22; i++) {
      const fakeAnswer = makeAnswer({ questionId: fakeQuestion.id })

      await answerRepository.create(fakeAnswer)
    }

    const firstAnswersPage = await sut.execute({
      questionId: fakeQuestion.id.toString(),
      page: 1,
    })
    const secondAnswersPage = await sut.execute({
      questionId: fakeQuestion.id.toString(),
      page: 2,
    })

    expect(firstAnswersPage.value?.answers).toHaveLength(20)
    expect(secondAnswersPage.value?.answers).toHaveLength(2)
  })
})
