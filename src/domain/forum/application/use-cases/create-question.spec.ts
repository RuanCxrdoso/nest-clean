import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let questionRepository: InMemoryQuestionRepository
let studentRepository: InMemoryStudentRepository
let attachmentRepository: InMemoryAttachmentsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase

describe('Create question test', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    studentRepository = new InMemoryStudentRepository()
    attachmentRepository = new InMemoryAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      studentRepository,
      attachmentRepository,
      questionAttachmentsRepository,
    )
    sut = new CreateQuestionUseCase(questionRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Como resolver integrais',
      content: 'Precio saber como resolver integrais.',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(questionRepository.questions[0]?.id).toBeTruthy()
    expect(questionRepository.questions[0]).toEqual(
      expect.objectContaining({
        title: 'Como resolver integrais',
        content: 'Precio saber como resolver integrais.',
      }),
    )
    expect(
      questionRepository.questions[0]?.attachments.currentItems,
    ).toHaveLength(2)
    expect(questionRepository.questions[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityId('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityId('2'),
      }),
    ])
  })

  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(questionAttachmentsRepository.questionAttachments).toHaveLength(2)
    expect(questionAttachmentsRepository.questionAttachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('2'),
        }),
      ]),
    )
  })
})
