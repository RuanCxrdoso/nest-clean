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

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: IQuestionRepository,
      useClass: PrismaQuestionRepository,
    },
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    {
      provide: IStudentRepository,
      useClass: PrismaStudentRepository,
    },
  ],
  exports: [
    PrismaService,
    IQuestionRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    IStudentRepository,
  ],
})
export class DatabaseModule {}
