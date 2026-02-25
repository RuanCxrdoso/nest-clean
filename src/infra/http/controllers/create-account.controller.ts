import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateStudentUseCase } from '@/domain/forum/application/use-cases/create-student'

const createAccountSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
})

export type CreateAccountDTO = z.infer<typeof createAccountSchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private createStudentUseCase: CreateStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountDTO) {
    const { name, email, password } = body

    const result = await this.createStudentUseCase.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      throw new Error('Fail to create student.')
    }
  }
}
