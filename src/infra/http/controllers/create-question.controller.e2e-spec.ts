import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Question [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js')
    const { PrismaService } = await import('@/infra/database/prisma/prisma.service.js')
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

  test('[POST] /question', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Ruan Cardoso',
        email: 'ruan@email.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Title',
        content: 'Question content',
      })

    expect(response.statusCode).toBe(201)

    const isQuestionOnDatabase = await prisma.question.findFirst({
      where: {
        content: 'Question content',
      },
    })

    expect(isQuestionOnDatabase).toBeTruthy()
  })
})
