import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ReadNotificationUseCase } from '@/domain/notifications/application/use-cases/read-notification'
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

@Controller('/notifications')
export class ReadNotificationController {
  constructor(private readNotificationUseCase: ReadNotificationUseCase) {}

  @Patch('/:id/read')
  @HttpCode(204)
  async handle(
    @Param('id') notificationId: string,
    @User() user: AccessTokenPayloadDTO,
  ) {
    const { sub: recipientId } = user

    const result = await this.readNotificationUseCase.execute({
      notificationId,
      recipientId,
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
  }
}
