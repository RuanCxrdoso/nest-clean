import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository'
import { FindQuestionBySlugUseCase } from './find-question-by-slug'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeAttachment } from 'test/factories/make-attachment'
import { MakeStudent } from 'test/factories/make-student'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let studentRepository: InMemoryStudentRepository
let attachmentRepository: InMemoryAttachmentsRepository
let questionRepository: InMemoryQuestionRepository
let sut: FindQuestionBySlugUseCase

describe('Find Question By Slug Use Case test', () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    studentRepository = new InMemoryStudentRepository()
    attachmentRepository = new InMemoryAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      studentRepository,
      attachmentRepository,
      questionAttachmentRepository,
    )
    sut = new FindQuestionBySlugUseCase(questionRepository)
  })

  it('should be able to find a question by slug', async () => {
    const student = MakeStudent({
      name: 'Arrascaeta',
    })
    await studentRepository.create(student)

    const fakeQuestion = makeQuestion({
      authorId: student.id,
      title: 'Fake question',
    })

    // Crio os attachments soltos
    const attachemnt1 = makeAttachment()
    await attachmentRepository.create(attachemnt1)

    // Crio o vínculo entre o attachment e a question
    const questionAttachment1 = makeQuestionAttachment({
      attachmentId: attachemnt1.id,
      questionId: fakeQuestion.id,
    })

    questionAttachmentRepository.questionAttachments.push(questionAttachment1)

    await questionRepository.create(fakeQuestion)

    const result = await sut.execute({ slug: fakeQuestion.slug.value })

    expect(result.isRight()).toBeTruthy()
    expect(questionRepository.questions[0]?.id).toBeTruthy()
    expect(questionRepository.questions[0]).toEqual(
      expect.objectContaining({
        title: fakeQuestion.title,
        content: fakeQuestion.content,
      }),
    )
    expect(result.value).toEqual({
      question: expect.objectContaining({
        title: fakeQuestion.title,
        author: student.name,
        attachments: expect.arrayContaining([attachemnt1]),
      }),
    })
  })
})
