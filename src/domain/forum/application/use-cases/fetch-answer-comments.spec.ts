import { beforeEach, describe, expect, it } from 'vitest'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { InMemoryAnswerCommentRepository } from '../../../../../test/repositories/in-memory-answer-comment-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { MakeStudent } from 'test/factories/make-student'

let studentRepository: InMemoryStudentRepository
let answerCommentsRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments use-case test', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    answerCommentsRepository = new InMemoryAnswerCommentRepository(
      studentRepository,
    )
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = MakeStudent()

    await studentRepository.create(student)

    const fakeAnswer = makeAnswer()

    const fakeAnswerComment1 = makeAnswerComment({
      answerId: fakeAnswer.id,
      authorId: student.id,
    })

    const fakeAnswerComment2 = makeAnswerComment({
      answerId: fakeAnswer.id,
      authorId: student.id,
    })

    const fakeAnswerComment3 = makeAnswerComment({
      answerId: fakeAnswer.id,
      authorId: student.id,
    })

    await answerCommentsRepository.create(fakeAnswerComment1)
    await answerCommentsRepository.create(fakeAnswerComment2)
    await answerCommentsRepository.create(fakeAnswerComment3)

    await sut.execute({
      answerId: fakeAnswer.id.toString(),
      page: 1,
    })

    expect(answerCommentsRepository.answerComments).toHaveLength(3)
    expect(answerCommentsRepository.answerComments).toEqual([
      expect.objectContaining({
        answerId: fakeAnswer.id,
        authorId: student.id,
      }),
      expect.objectContaining({
        answerId: fakeAnswer.id,
        authorId: student.id,
      }),
      expect.objectContaining({
        answerId: fakeAnswer.id,
        authorId: student.id,
      }),
    ])
  })

  it('should be able to paginate fetch answer comments', async () => {
    const student = MakeStudent()

    await studentRepository.create(student)

    const fakeAnswer = makeAnswer()

    for (let i = 1; i <= 22; i++) {
      const fakeAnswerComment = makeAnswerComment({
        answerId: fakeAnswer.id,
        authorId: student.id,
      })

      await answerCommentsRepository.create(fakeAnswerComment)
    }

    const firstAnswerCommentsPage = await sut.execute({
      answerId: fakeAnswer.id.toString(),
      page: 1,
    })
    const secondAnswerCommentsPage = await sut.execute({
      answerId: fakeAnswer.id.toString(),
      page: 2,
    })

    expect(firstAnswerCommentsPage.value?.comments).toHaveLength(20)
    expect(secondAnswerCommentsPage.value?.comments).toHaveLength(2)
  })
})
