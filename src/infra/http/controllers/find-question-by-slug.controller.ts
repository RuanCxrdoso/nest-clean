import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FindQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/find-question-by-slug'
import { QuestionDetailsPresenter } from '@/infra/http/presenters/question-details-presenter'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'

@Controller('/questions')
export class FindQuestionBySlugController {
  constructor(private findQuestionBySlugUseCase: FindQuestionBySlugUseCase) {}

  @Get('/:slug')
  async handle(@Param('slug') slug: string) {
    const result = await this.findQuestionBySlugUseCase.execute({ slug })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            message: error.message,
          })
        default:
          throw new BadRequestException()
      }
    }

    const question = QuestionDetailsPresenter.toHTTP(result.value.question)

    return {
      question,
    }
  }
}
