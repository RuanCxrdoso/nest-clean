import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Auth Controller [E2E]', () => {
  let app: INestApplication

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js')

    const refModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = refModule.createNestApplication()

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /auth/login', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'Ruan Cardoso',
      email: 'ruan@email.com',
      password: '123456',
    })

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'ruan@email.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.access_token).toBeTypeOf('string')
  })
})
