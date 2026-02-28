import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { type AccessTokenPayloadDTO } from '@/infra/auth/jwt.strategy'
import { User } from '@/infra/auth/user-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import z from 'zod'

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

export type commentOnAnswerDTO = z.infer<typeof commentOnAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

@Controller('/answers')
export class CommentOnAnswerController {
  constructor(private commentOnAnswerUseCase: CommentOnAnswerUseCase) {}

  @Post('/:id/comments')
  @HttpCode(201)
  async handle(
    @Param('id') answerId: string,
    @Body(bodyValidationPipe) body: commentOnAnswerDTO,
    @User() user: AccessTokenPayloadDTO,
  ) {
    const { content } = body
    const { sub: authorId } = user

    const result = await this.commentOnAnswerUseCase.execute({
      authorId,
      answerId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
