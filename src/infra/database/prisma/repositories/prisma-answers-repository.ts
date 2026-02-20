import {
  FindManyByQuestionIdProps,
  IAnswersRepository,
} from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswersRepository implements IAnswersRepository {
  create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  save(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  delete(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findById(answerId: string): Promise<Answer | null> {
    throw new Error('Method not implemented.')
  }
  findManyByQuestionId({
    id,
    page,
  }: FindManyByQuestionIdProps): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }
}
