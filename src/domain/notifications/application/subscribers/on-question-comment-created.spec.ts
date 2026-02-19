import { beforeEach, describe, expect, it, vi } from 'vitest'
import { makeQuestion } from '../../../../../test/factories/make-question.js'
import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository.js'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository.js'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment.js'
import { InMemoryQuestionCommentRepository } from '../../../../../test/repositories/in-memory-question-comment-repository.js'
import { SendNotificationUseCase } from '../use-cases/send-notification.js'
import { InMemoryNotificationsRepository } from '../../../../../test/repositories/in-memory-notifications-repository.js'
import { OnQuestionCommentCreated } from './on-question-comment-created.js'

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
