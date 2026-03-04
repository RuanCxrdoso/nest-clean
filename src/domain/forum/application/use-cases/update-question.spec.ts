import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { UpdateQuestionUseCase } from './update-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { makeQuestionAttachment } from '../../../../../test/factories/make-question-attachment'

let questionRepository: InMemoryQuestionRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let sut: UpdateQuestionUseCase

describe('Update question Use Case test', () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentRepository,
    )
    sut = new UpdateQuestionUseCase(
      questionRepository,
      questionAttachmentRepository,
    )
  })

  it('should be able to update a question', async () => {
    const fakeQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    )

    const attachments: QuestionAttachment[] = []

    for (let i = 1; i <= 2; i++) {
      const questionAttachment = makeQuestionAttachment({
        questionId: fakeQuestion.id,
        attachmentId: new UniqueEntityId(i.toString()), // '1' e '2'
      })

      questionAttachmentRepository.questionAttachments.push(questionAttachment)

      attachments.push(questionAttachment)
    }

    fakeQuestion.attachments = new QuestionAttachmentList(attachments)

    await questionRepository.create(fakeQuestion)

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      title: 'titulo de teste',
      content: 'conteudo de teste',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(questionRepository.questions[0]).toEqual(
      expect.objectContaining({
        title: 'titulo de teste',
        content: 'conteudo de teste',
      }),
    )

    expect(
      questionRepository.questions[0]?.attachments.currentItems,
    ).toHaveLength(2)

    expect(questionRepository.questions[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('shouldnt be able to update a question from another user', async () => {
    const fakeQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1'),
    )

    await questionRepository.create(fakeQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
      title: 'titulo de teste',
      content: 'conteudo de teste',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should sync new and removed attachment when editing a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await questionRepository.create(newQuestion)

    questionAttachmentRepository.questionAttachments.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-1',
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(questionAttachmentRepository.questionAttachments).toHaveLength(2)

    expect(questionAttachmentRepository.questionAttachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('3'),
        }),
      ]),
    )
  })
})
