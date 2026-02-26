import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const { AppModule } = await import('../../app.module')
    const { PrismaService } =
      await import('../../database/prisma/prisma.service')

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Ruan Cardoso E2E',
      email: 'ruane2e@email.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    const userOnDataBase = await prisma.user.findFirst({
      where: {
        email: 'ruane2e@email.com',
      },
    })

    expect(userOnDataBase).toBeTruthy()
  })
})
