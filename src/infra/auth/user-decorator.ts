import { AccessTokenPayloadDTO } from '@/infra/auth/jwt.strategy'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((_: never, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  return request.user as AccessTokenPayloadDTO
})
