import { beforeEach, describe, expect, it } from 'vitest'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer.js'
import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository.js'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository.js'
import { makeQuestion } from '../../../../../test/factories/make-question.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import { makeAnswer } from '../../../../../test/factories/make-answer.js'
import { NotAllowedError } from '@/core/errors/not-allowed-error.js'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository.js'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository.js'

let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let questionRepository: InMemoryQuestionRepository
let answerRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose question best answer tests', () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentRepository,
    )
    answerRepository = new InMemoryAnswersRepository(answerAttachmentRepository)
    sut = new ChooseQuestionBestAnswerUseCase(
      answerRepository,
      questionRepository,
    )
  })

  it('should be able to set question best answer', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    )
    await questionRepository.create(newQuestion)

    const answer = makeAnswer(
      { questionId: newQuestion.id },
      new UniqueEntityId('answer-1'),
    )

    await answerRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-1',
    })

    expect(result.isRight()).toBe(true)
    expect(questionRepository.questions[0]?.bestAnswerId?.toString()).toEqual(
      'answer-1',
    )
  })

  it('shouldnt be able to set a question best answer from a question from another user', async () => {
    const newQuestion = makeQuestion()

    await questionRepository.create(newQuestion)

    const answer = makeAnswer({ questionId: newQuestion.id })

    await answerRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
