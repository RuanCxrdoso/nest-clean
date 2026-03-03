import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachment'

describe('Update Answer Controller [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT /answers/:id]', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id.toString(),
      questionId: question.id.toString(),
      content: 'Earlier content',
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment1.id,
    })

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment2.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })
    const answerId = answer.id.toString()

    const attachment3 = await attachmentFactory.makePrismaAttachment()
    const attachment4 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Content updated',
        attachmentsIds: [
          attachment2.id.toString(),
          attachment3.id.toString(),
          attachment4.id.toString(),
        ],
      })

    expect(response.statusCode).toBe(204)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: 'Content updated',
      },
    })

    expect(answerOnDatabase).toBeTruthy()

    const answerAttachemntsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answer.id.toString(),
      },
    })

    expect(answerAttachemntsOnDatabase).toHaveLength(3)
    expect(answerAttachemntsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment2.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
        expect.objectContaining({
          id: attachment4.id.toString(),
        }),
      ]),
    )
  })
})
