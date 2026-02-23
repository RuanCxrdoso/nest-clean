import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { type AccessTokenPayloadDTO } from '@/infra/auth/jwt.strategy'
import { User } from '@/infra/auth/user-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import z from 'zod'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

export type createQuestionDTO = z.infer<typeof createQuestionBodySchema>
const zodValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/question')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestionUseCase: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(zodValidationPipe) body: createQuestionDTO,
    @User() user: AccessTokenPayloadDTO,
  ) {
    const { title, content } = body
    const { sub: userId } = user

    await this.createQuestionUseCase.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    })
  }
}
