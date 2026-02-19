import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository.js'
import { makeQuestion } from '../../../../../test/factories/make-question.js'
import { DeleteQuestionUseCase } from './delete-question.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import { NotAllowedError } from '@/core/errors/not-allowed-error.js'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository.js'
import { makeQuestionAttachment } from '../../../../../test/factories/make-question-attachment.js'

let questionRepository: InMemoryQuestionRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete question Use Case test', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(questionRepository)
  })

  it('should be able to delete a question', async () => {
    const fakeQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    )

    await questionRepository.create(fakeQuestion)

    for (let i = 1; i <= 2; i++) {
      const questionAttachment = makeQuestionAttachment({
        questionId: fakeQuestion.id,
        attachmentId: new UniqueEntityId(i.toString()), // '1' e '2'
      })

      questionAttachmentsRepository.questionAttachments.push(questionAttachment)
    }

    await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
    })

    expect(questionRepository.questions).toHaveLength(0)
    expect(questionAttachmentsRepository.questionAttachments).toHaveLength(0)
  })

  it('shouldnt be able to delete a question from another user', async () => {
    const fakeQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    )

    await questionRepository.create(fakeQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
