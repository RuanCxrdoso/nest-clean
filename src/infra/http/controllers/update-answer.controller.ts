import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UpdateAnswerUseCase } from '@/domain/forum/application/use-cases/update-answer'
import { type AccessTokenPayloadDTO } from '@/infra/auth/jwt.strategy'
import { User } from '@/infra/auth/user-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import z from 'zod'

const updateAnswerBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string()),
})

export type updateAnswerDTO = z.infer<typeof updateAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(updateAnswerBodySchema)

@Controller('/answers')
export class UpdateAnswerController {
  constructor(private updateAnswerUseCase: UpdateAnswerUseCase) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') answerId: string,
    @Body(bodyValidationPipe) body: updateAnswerDTO,
    @User() user: AccessTokenPayloadDTO,
  ) {
    const { content, attachmentsIds } = body
    const authorId = user.sub

    const result = await this.updateAnswerUseCase.execute({
      authorId,
      answerId,
      content,
      attachmentsIds,
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

    return
  }
}
