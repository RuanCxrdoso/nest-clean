import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Find Question by slug [E2E]', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js')
    const { JwtService } = await import('@nestjs/jwt')
    const { DatabaseModule } =
      await import('@/infra/database/database.module.js')

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

  test('[GET] /questions/:slug', async () => {
    const student = await studentFactory.makePrismaStudent()

    await questionFactory.makePrismaQuestion({
      authorId: student.id,
      title: 'Title-1',
      slug: Slug.create('title-1'),
    })

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/questions/title-1`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.question).toEqual(
      expect.objectContaining({
        slug: 'title-1',
      }),
    )
  })
})
