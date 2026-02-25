import { beforeEach, describe, expect, it, vi } from 'vitest'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from '../../../../../test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { OnQuestionBestAnswerChoose } from './on-question-best-answer-choose'

let sendNotificationUseCase: SendNotificationUseCase
let notificationsRepository: InMemoryNotificationsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionRepository: InMemoryQuestionRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRespository: InMemoryAnswersRepository

let sendNotificationExecuteSpy

describe('On question best answer chosen', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRespository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
  })

  it('should send a notification when a best answer is chosen', async () => {
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionBestAnswerChoose(answersRespository, sendNotificationUseCase)

    const question = makeQuestion()

    await questionRepository.create(question)

    const answer = makeAnswer({
      questionId: question.id,
    })

    await answersRespository.create(answer)

    question.bestAnswerId = answer.id

    await questionRepository.save(question)

    expect(sendNotificationExecuteSpy).toHaveBeenCalled()
  })
})
