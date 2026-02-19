import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository.js'
import { DeleteAnswerUseCase } from './delete-answer.js'
import { makeAnswer } from '../../../../../test/factories/make-answer.js'
import { NotAllowedError } from '@/core/errors/not-allowed-error.js'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository.js'
import { makeAnswerAttachment } from '../../../../../test/factories/make-answer-attachment.js'

let answerRepository: InMemoryAnswersRepository
let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase

describe('Delete answer Use Case test', () => {
  beforeEach(() => {
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(answerAttachmentRepository)
    sut = new DeleteAnswerUseCase(answerRepository)
  })

  it('should be able to delete a answer', async () => {
    const fakeAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    )

    await answerRepository.create(fakeAnswer)

    for (let i = 1; i <= 2; i++) {
      const answerAttachment = makeAnswerAttachment({
        answerId: fakeAnswer.id,
        attachmentId: new UniqueEntityId(i.toString()), // '1' e '2'
      })

      answerAttachmentRepository.answerAttachments.push(answerAttachment)
    }

    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
    })

    expect(answerRepository.answers).toHaveLength(0)
    expect(answerAttachmentRepository.answerAttachments).toHaveLength(0)
  })

  it('shouldnt be able to delete a question from another user', async () => {
    const fakeAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    )

    await answerRepository.create(fakeAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
