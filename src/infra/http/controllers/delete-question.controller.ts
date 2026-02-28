import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { type AccessTokenPayloadDTO } from '@/infra/auth/jwt.strategy'
import { User } from '@/infra/auth/user-decorator'
import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'

@Controller('/questions')
export class DeleteQuestionController {
  constructor(private deleteQuestionUseCase: DeleteQuestionUseCase) {}

  @Delete('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') questionId: string,
    @User() user: AccessTokenPayloadDTO,
  ) {
    const authorId = user.sub

    const result = await this.deleteQuestionUseCase.execute({
      authorId,
      questionId,
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
