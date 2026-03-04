import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch Question Comments [E2E]', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js')
    const { JwtService } = await import('@nestjs/jwt')
    const { StudentFactory } = await import('test/factories/make-student.js')
    const { QuestionFactory } = await import('test/factories/make-question.js')

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /questions/:questionId/comments', async () => {
    const student = await studentFactory.makePrismaStudent({
      name: 'Cristiano Ronaldin',
    })
    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    for (let i = 1; i <= 2; i++) {
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: student.id,
        questionId: question.id,
        content: `Content -${i}`,
      })
    }

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id}/comments`)
      .query({ page: '1' })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: 'Content -1',
          name: 'Cristiano Ronaldin',
        }),
        expect.objectContaining({
          content: 'Content -2',
          name: 'Cristiano Ronaldin',
        }),
      ]),
    })
  })
})
