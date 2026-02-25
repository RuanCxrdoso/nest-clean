import { beforeEach, describe, expect, it } from 'vitest'
import { Instructor } from '../../enterprise/entities/instructor'
import { Question } from '../../enterprise/entities/question'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository'
import { MakeStudent } from 'test/factories/make-student'

let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let answerRepository: InMemoryAnswersRepository

describe('Answer question tests', () => {
  beforeEach(() => {
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(answerAttachmentRepository)
  })

  it('should be able to answer a question', async () => {
    const instructor = Instructor.create({ name: 'Ruan' })
    const student = MakeStudent({ name: 'Neymar' })

    const question = Question.create({
      title: 'Triceps',
      content: 'Como treinar o triceps ?',
      slug: Slug.createFromText('Triceps'),
      authorId: student.id,
    })

    const answerQuestionUseCase = new AnswerQuestionUseCase(answerRepository)

    const result = await answerQuestionUseCase.execute({
      instructorId: instructor.id,
      questionId: question.id,
      content: 'Faça triceps pulley!',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(answerRepository.answers[0]?.id).toEqual(result.value?.answer.id)
    expect(answerRepository.answers[0]?.attachments.currentItems).toHaveLength(
      2,
    )
    expect(answerRepository.answers[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityId('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityId('2'),
      }),
    ])
  })
})
