import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import z from 'zod'
import { AuthStudentUseCase } from '@/domain/forum/application/use-cases/auth-student'

const authBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type authDTO = z.infer<typeof authBodySchema>

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
      throw new UnauthorizedException({
        message: 'Invalid credentials',
      })
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
