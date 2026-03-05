import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from '../../../../../test/factories/make-question-attachment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let questionRepository: InMemoryQuestionRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let studentRepository: InMemoryStudentRepository
let attachmentRepository: InMemoryAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete question Use Case test', () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    studentRepository = new InMemoryStudentRepository()
    attachmentRepository = new InMemoryAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      studentRepository,
      attachmentRepository,
      questionAttachmentRepository,
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

      questionAttachmentRepository.questionAttachments.push(questionAttachment)
    }

    await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
    })

    expect(questionRepository.questions).toHaveLength(0)
    expect(questionAttachmentRepository.questionAttachments).toHaveLength(0)
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
