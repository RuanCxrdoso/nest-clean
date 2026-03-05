import { beforeEach, describe, expect, it } from 'vitest'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { InMemoryQuestionCommentRepository } from '../../../../../test/repositories/in-memory-question-comment-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { MakeStudent } from 'test/factories/make-student'

let questionCommentsRepository: InMemoryQuestionCommentRepository
let studentsRepository: InMemoryStudentRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments use-case test', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentRepository()
    questionCommentsRepository = new InMemoryQuestionCommentRepository(
      studentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = MakeStudent({
      name: 'Neymar Jr',
    })

    studentsRepository.items.push(student)

    const fakeQuestion = makeQuestion()

    const fakeQuestionComment1 = makeQuestionComment({
      questionId: fakeQuestion.id,
      authorId: student.id,
    })

    const fakeQuestionComment2 = makeQuestionComment({
      questionId: fakeQuestion.id,
      authorId: student.id,
    })

    const fakeQuestionComment3 = makeQuestionComment({
      questionId: fakeQuestion.id,
      authorId: student.id,
    })

    await questionCommentsRepository.create(fakeQuestionComment1)
    await questionCommentsRepository.create(fakeQuestionComment2)
    await questionCommentsRepository.create(fakeQuestionComment3)

    const questionComments = await sut.execute({
      questionId: fakeQuestion.id.toString(),
      page: 1,
    })

    expect(questionComments.value?.comments).toHaveLength(3)
    expect(questionComments.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'Neymar Jr',
          commentId: fakeQuestionComment1.id.toString(),
        }),
        expect.objectContaining({
          author: 'Neymar Jr',
          commentId: fakeQuestionComment2.id.toString(),
        }),
        expect.objectContaining({
          author: 'Neymar Jr',
          commentId: fakeQuestionComment3.id.toString(),
        }),
      ]),
    )
  })

  it('should be able to paginate fetch question comments', async () => {
    const student = MakeStudent({
      name: 'Neymar Jr',
    })

    studentsRepository.items.push(student)

    const fakeQuestion = makeQuestion()

    for (let i = 1; i <= 22; i++) {
      const fakeQuestionComment = makeQuestionComment({
        questionId: fakeQuestion.id,
        authorId: student.id,
      })

      await questionCommentsRepository.create(fakeQuestionComment)
    }

    const firstQuestionCommentsPage = await sut.execute({
      questionId: fakeQuestion.id.toString(),
      page: 1,
    })
    const secondQuestionCommentsPage = await sut.execute({
      questionId: fakeQuestion.id.toString(),
      page: 2,
    })

    expect(firstQuestionCommentsPage.value?.comments).toHaveLength(20)
    expect(secondQuestionCommentsPage.value?.comments).toHaveLength(2)
  })
})
