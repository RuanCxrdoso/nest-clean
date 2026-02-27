import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch Recent Questions [E2E]', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js')
    const { JwtService } = await import('@nestjs/jwt')
    const { StudentFactory } = await import('test/factories/make-student.js')
    const { QuestionFactory } = await import('test/factories/make-question.js')

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /questions', async () => {
    const student = await studentFactory.makePrismaStudent()

    for (let i = 1; i <= 2; i++) {
      await questionFactory.makePrismaQuestion({
        authorId: student.id,
        title: `Title 0${i}`,
      })
    }

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .query({ page: '1' })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({
          title: 'Title 01',
        }),
        expect.objectContaining({
          title: 'Title 02',
        }),
      ]),
    })
  })
})
