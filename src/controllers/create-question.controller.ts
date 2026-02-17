import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { type AccessTokenPayloadDTO } from '@/auth/jwt.strategy'
import { User } from '@/auth/user-decorator'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import z from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

export type createQuestionDTO = z.infer<typeof createQuestionBodySchema>

@Controller('/question')
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
  handle(@Body() body: createQuestionDTO, @User() user: AccessTokenPayloadDTO) {
    console.log('🚀 ~ CreateQuestionController ~ handle ~ body:', body)
    console.log(user.sub)
    return 'ok'
  }
}
