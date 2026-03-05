import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'

describe('Auth Controller [E2E]', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let hashGenerator: HashGenerator

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js')

    const refModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [StudentFactory],
    }).compile()

    app = refModule.createNestApplication()
    studentFactory = refModule.get(StudentFactory)
    hashGenerator = refModule.get(HashGenerator)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /auth/login', async () => {
    const student = await studentFactory.makePrismaStudent({
      name: 'Ruan Cardoso',
      password: await hashGenerator.hash('123456'),
    })

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: student.email,
        password: '123456',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.access_token).toBeTypeOf('string')
  })
})
