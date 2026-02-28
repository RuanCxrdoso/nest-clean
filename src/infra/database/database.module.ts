import { IQuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { IStudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from '@/infra/database/prisma/repositories/prisma-answer-comment-repository'
import { PrismaAnswersRepository } from '@/infra/database/prisma/repositories/prisma-answers-repository'
import { PrismaQuestionAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from '@/infra/database/prisma/repositories/prisma-question-comment-repository'
import { PrismaQuestionRepository } from '@/infra/database/prisma/repositories/prisma-question-repository'
import { PrismaStudentRepository } from '@/infra/database/prisma/repositories/prisma-student-repository'
import { EnvModule } from '@/infra/env/env.module'
import { Module } from '@nestjs/common'
import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { IQuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { IAnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: IQuestionRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: IQuestionCommentRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: IAnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: IAnswerCommentRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: IAnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: IStudentRepository,
      useClass: PrismaStudentRepository,
    },
    {
      provide: IQuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    IQuestionRepository,
    IQuestionCommentRepository,
    IAnswersRepository,
    IAnswerCommentRepository,
    IAnswerAttachmentsRepository,
    IStudentRepository,
    IQuestionAttachmentsRepository,
  ],
})
export class DatabaseModule {}
