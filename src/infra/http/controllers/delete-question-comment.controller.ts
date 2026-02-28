import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
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

@Controller('/questions/comments')
export class DeleteQuestionCommentController {
  constructor(
    private deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase,
  ) {}

  @Delete('/:id')
  @HttpCode(204)
  async handle(
    @Param('id') questionCommentId: string,
    @User() user: AccessTokenPayloadDTO,
  ) {
    const authorId = user.sub

    const result = await this.deleteQuestionCommentUseCase.execute({
      authorId,
      questionCommentId,
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
          throw new BadRequestException({
            message: error.message,
          })
      }
    }

    return
  }
}
