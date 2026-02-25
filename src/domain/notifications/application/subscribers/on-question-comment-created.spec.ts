import { beforeEach, describe, expect, it, vi } from 'vitest'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment'
import { InMemoryQuestionCommentRepository } from '../../../../../test/repositories/in-memory-question-comment-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from '../../../../../test/repositories/in-memory-notifications-repository'
import { OnQuestionCommentCreated } from './on-question-comment-created'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionRepository
let questionCommentRepository: InMemoryQuestionCommentRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationSpy

describe('Question comment created event tests', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    questionCommentRepository = new InMemoryQuestionCommentRepository()
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )
  })

  it('should send a notification when a comment is created', async () => {
    sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')
    new OnQuestionCommentCreated(questionsRepository, sendNotificationUseCase)

    const question = makeQuestion()
    await questionsRepository.create(question)

    const questionComment = makeQuestionComment({
      questionId: question.id,
    })
    await questionCommentRepository.create(questionComment)

    expect(sendNotificationSpy).toHaveBeenCalled()
  })
})
