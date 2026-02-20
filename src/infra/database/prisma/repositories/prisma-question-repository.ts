import { PaginationParams } from '@/core/repositories/pagination-params'
import { IQuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionRepository implements IQuestionRepository {
  constructor(private prisma: PrismaService) {}
  create(question: Question): Promise<Question> {
    throw new Error('Method not implemented.')
  }
  delete(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }
  save(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findBySlug(slug: string): Promise<Question | null> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<Question | null> {
    throw new Error('Method not implemented.')
  }
  findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.')
  }
}
