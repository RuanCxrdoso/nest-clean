import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import z from 'zod'
import { AuthStudentUseCase } from '@/domain/forum/application/use-cases/auth-student'
import { InvalidCredentialsError } from '@/domain/forum/application/use-cases/errors/invalid-credentials-error'
import { Public } from '@/infra/http/is-public-decorator'

const authBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type authDTO = z.infer<typeof authBodySchema>

@Public()
@Controller('/auth')
export class AuthController {
  constructor(private authStudent: AuthStudentUseCase) {}

  @Post('/login')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authBodySchema))
  async handle(@Body() body: authDTO) {
    const { email, password } = body

    const result = await this.authStudent.execute({ email, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
