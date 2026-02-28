import { type AccessTokenPayloadDTO } from '@/infra/auth/jwt.strategy'
import { User } from '@/infra/auth/user-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import z from 'zod'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string()).default([]),
})

export type answerQuestionDTO = z.infer<typeof answerQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

@Controller('/questions')
export class AnswerQuestionController {
  constructor(private answerQuestionUseCase: AnswerQuestionUseCase) {}

  @Post('/:id/answers')
  @HttpCode(201)
  async handle(
    @Param('id') questionId: string,
    @Body(bodyValidationPipe) body: answerQuestionDTO,
    @User() user: AccessTokenPayloadDTO,
  ) {
    const { content } = body
    const { sub: authorId } = user

    const result = await this.answerQuestionUseCase.execute({
      authorId,
      questionId,
      content,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
