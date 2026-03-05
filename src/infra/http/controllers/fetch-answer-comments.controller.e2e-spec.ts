import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch Answer Comments [E2E]', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js')
    const { JwtService } = await import('@nestjs/jwt')
    const { StudentFactory } = await import('test/factories/make-student.js')
    const { AnswerFactory } = await import('test/factories/make-answer.js')

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /answers/:answerId/comments', async () => {
    const student = await studentFactory.makePrismaStudent({
      name: 'Travis Scott',
    })
    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      authorId: student.id.toString(),
      questionId: question.id.toString(),
    })

    for (let i = 1; i <= 2; i++) {
      await answerCommentFactory.makePrismaAnswerComment({
        authorId: student.id,
        answerId: answer.id,
        content: `Answer comment ${i}`,
      })
    }

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id}/comments`)
      .query({ page: '1' })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: 'Answer comment 1',
          author: 'Travis Scott',
        }),
        expect.objectContaining({
          content: 'Answer comment 2',
          author: 'Travis Scott',
        }),
      ]),
    })
  })
})
