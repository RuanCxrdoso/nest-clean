import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

const createAccountSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
})

export type CreateAccountDTO = z.infer<typeof createAccountSchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountDTO) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('Email already in use')
    }

    const hashPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    })
  }
}
