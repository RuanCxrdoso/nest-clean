import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import z from 'zod'
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

const authBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type authDTO = z.infer<typeof authBodySchema>

@Controller('/auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post('/login')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authBodySchema))
  async handle(@Body() body: authDTO) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException({
        message: 'User credentials do not match.',
      })
    }

    const isPasswordCorrect = await compare(password, user.password)

    if (!isPasswordCorrect) {
      throw new UnauthorizedException({
        message: 'User credentials do not match.',
      })
    }

    const accessToken = await this.jwt.signAsync({ sub: user.id })

    return { access_token: accessToken }
  }
}
