import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { IStudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

interface CreateStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type CreateStudentUseCaseResponse = Either<NotAllowedError, object>

export class CreateStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateStudentUseCaseRequest): Promise<CreateStudentUseCaseResponse> {
    const result = await this.studentRepository.findByEmail(email)

    if (result) {
      return left(new NotAllowedError())
    }

    const student = Student.create({ name, email, password })

    await this.studentRepository.create(student)

    return right({})
  }
}
