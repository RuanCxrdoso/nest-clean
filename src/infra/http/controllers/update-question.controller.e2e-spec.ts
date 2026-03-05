import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('Edit Question [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const { AppModule } = await import('@/infra/app.module.js')
    const { PrismaService } =
      await import('@/infra/database/prisma/prisma.service.js')
    const { JwtService } = await import('@nestjs/jwt')

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const questionAttachment1 =
      await questionAttachmentFactory.makePrismaQuestionAttachment({
        questionId: question.id,
        attachmentId: attachment1.id,
      })

    const questionAttachment2 =
      await questionAttachmentFactory.makePrismaQuestionAttachment({
        questionId: question.id,
        attachmentId: attachment2.id,
      })

    question.attachments = new QuestionAttachmentList([
      questionAttachment1,
      questionAttachment2,
    ])

    const attachment3 = await attachmentFactory.makePrismaAttachment()
    const attachment4 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated unique title',
        content: 'Updated content',
        attachmentsIds: [
          attachment2.id.toString(),
          attachment3.id.toString(),
          attachment4.id.toString(),
        ],
      })

    expect(response.statusCode).toBe(200)

    const isQuestionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'Updated unique title',
        content: 'Updated content',
      },
    })

    expect(isQuestionOnDatabase).toBeTruthy()

    const attachmentsOnDataBase = await prisma.attachment.findMany({
      where: {
        questionId: question.id.toString(),
      },
    })

    expect(attachmentsOnDataBase).toHaveLength(3)

    const attachmentdsIds = attachmentsOnDataBase.map((item) => item.id)

    expect(attachmentdsIds).toEqual([
      attachment2.id.toString(),
      attachment3.id.toString(),
      attachment4.id.toString(),
    ])
  })
})
