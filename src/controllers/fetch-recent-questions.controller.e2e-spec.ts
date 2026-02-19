import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch Recent Questions [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const { AppModule } = await import('@/app.module.js')
    const { PrismaService } = await import('@/prisma/prisma.service.js')
    const { JwtService } = await import('@nestjs/jwt')

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Ruan',
        email: 'ruan@email.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          authorId: user.id,
          slug: 'title-1',
          title: 'Title-1',
          content: 'Question content',
        },
        {
          authorId: user.id,
          slug: 'title-2',
          title: 'Title-2',
          content: 'Question content 1',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .query({ page: '1' })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.questions).toEqual([
      expect.objectContaining({
        title: 'Title-1',
      }),
      expect.objectContaining({
        title: 'Title-2',
      }),
    ])
  })
})
