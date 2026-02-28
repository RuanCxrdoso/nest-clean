import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
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

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

export type commentOnQuestionDTO = z.infer<typeof commentOnQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

@Controller('/questions')
export class CommentOnQuestionController {
  constructor(private commentOnQuestionUseCase: CommentOnQuestionUseCase) {}

  @Post('/:id/comments')
  @HttpCode(201)
  async handle(
    @Param('id') questionId: string,
    @Body(bodyValidationPipe) body: commentOnQuestionDTO,
    @User() user: AccessTokenPayloadDTO,
  ) {
    const { content } = body
    const { sub: authorId } = user

    const result = await this.commentOnQuestionUseCase.execute({
      authorId,
      questionId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
