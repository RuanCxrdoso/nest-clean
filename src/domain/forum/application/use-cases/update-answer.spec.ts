import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository.js'
import { UpdateAnswerUseCase } from './update-answer.js'
import { makeAnswer } from '../../../../../test/factories/make-answer.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import { NotAllowedError } from '@/core/errors/not-allowed-error.js'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository.js'
import { makeAnswerAttachment } from '../../../../../test/factories/make-answer-attachment.js'

let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let answerRepository: InMemoryAnswersRepository
let sut: UpdateAnswerUseCase

describe('Update answer use case tests', () => {
  beforeEach(() => {
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(answerAttachmentRepository)
    sut = new UpdateAnswerUseCase(answerRepository, answerAttachmentRepository)
  })

  it('should be able to update a answer', async () => {
    const answer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    )

    for (let i = 1; i <= 2; i++) {
      const answerAttachment = makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityId(i.toString()), // '1' e '2'
      })

      answerAttachmentRepository.answerAttachments.push(answerAttachment)
    }

    await answerRepository.create(answer)

    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'Novo content.',
      attachmentsIds: ['1', '3'],
    })

    expect(answerRepository.answers[0]).toMatchObject({
      content: 'Novo content.',
    })
    expect(answerRepository.answers[0]?.attachments.currentItems).toHaveLength(
      2,
    )

    expect(answerRepository.answers[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('shouldnt be able to update a answer from another author', async () => {
    const answer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1'),
    )

    await answerRepository.create(answer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
      content: 'Novo content.',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
