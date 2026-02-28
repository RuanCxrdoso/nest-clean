import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UpdateQuestionUseCase } from '@/domain/forum/application/use-cases/update-question'
import { type AccessTokenPayloadDTO } from '@/infra/auth/jwt.strategy'
import { User } from '@/infra/auth/user-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { QuestionPresenter } from '@/infra/http/presenters/question-presenter'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import z from 'zod'

const updateQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachmentsIds: z.array(z.string()).default([]),
})

const bodyValidationPipe = new ZodValidationPipe(updateQuestionBodySchema)

export type UpdateQuestionDTO = z.infer<typeof updateQuestionBodySchema>

@Controller('/questions')
export class UpdateQuestionController {
  constructor(private updateQuestionUseCase: UpdateQuestionUseCase) {}

  @Put('/:id')
  async handle(
    @Param('id') questionId: string,
    @User() user: AccessTokenPayloadDTO,
    @Body(bodyValidationPipe) body: UpdateQuestionDTO,
  ) {
    const result = await this.updateQuestionUseCase.execute({
      authorId: user.sub,
      questionId,
      ...body,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            message: error.message,
          })
        case NotAllowedError:
          throw new ForbiddenException({
            message: error.message,
          })
        default:
          throw new BadRequestException()
      }
    }

    const { question } = result.value

    return {
      question: QuestionPresenter.toHTTP(question),
    }
  }
}
