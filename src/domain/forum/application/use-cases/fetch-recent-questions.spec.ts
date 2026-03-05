import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let questionRepository: InMemoryQuestionRepository
let studentRepository: InMemoryStudentRepository
let attachmentRepository: InMemoryAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch recents questions use-case test', () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    studentRepository = new InMemoryStudentRepository()
    attachmentRepository = new InMemoryAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      studentRepository,
      attachmentRepository,
      questionAttachmentRepository,
    )
    sut = new FetchRecentQuestionsUseCase(questionRepository)
  })

  it('should be able to fetch recents questions', async () => {
    const fakeQuestion1 = makeQuestion({ createdAt: new Date(2026, 0, 10) })
    const fakeQuestion2 = makeQuestion({ createdAt: new Date(2026, 0, 11) })
    const fakeQuestion3 = makeQuestion({ createdAt: new Date(2026, 0, 12) })

    await questionRepository.create(fakeQuestion1)
    await questionRepository.create(fakeQuestion2)
    await questionRepository.create(fakeQuestion3)

    const questions = await sut.execute({ page: 1 })

    expect(questions.value?.questions).toHaveLength(3)
    expect(questions.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2026, 0, 12) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 11) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 10) }),
    ])
  })

  it('should be able to paginate fetch recents questions', async () => {
    for (let i = 1; i <= 22; i++) {
      const fakeQuestion = makeQuestion({ createdAt: new Date(2026, 0, 10) })

      await questionRepository.create(fakeQuestion)
    }

    const firstQuestionsPage = await sut.execute({ page: 1 })
    const secondQuestionsPage = await sut.execute({ page: 2 })

    expect(firstQuestionsPage.value?.questions).toHaveLength(20)
    expect(secondQuestionsPage.value?.questions).toHaveLength(2)
  })
})
