import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { type AccessTokenPayloadDTO } from '@/infra/auth/jwt.strategy'
import { User } from '@/infra/auth/user-decorator'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('/answers')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch('/:answerId/choose-as-best')
  @HttpCode(204)
  async handle(
    @Param('answerId') answerId: string,
    @User() user: AccessTokenPayloadDTO,
  ) {
    const result = await this.chooseQuestionBestAnswerUseCase.execute({
      authorId: user.sub,
      answerId,
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
