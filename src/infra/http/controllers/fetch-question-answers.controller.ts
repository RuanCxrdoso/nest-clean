import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'
import z from 'zod'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { AnswerPresenter } from '@/infra/http/presenters/answer-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamType = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase,
  ) {}

  @Get('/:questionId/answers')
  @HttpCode(200)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamType,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswersUseCase.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answers = result.value.answers.map(AnswerPresenter.toHTTP)

    return {
      answers,
    }
  }
}
