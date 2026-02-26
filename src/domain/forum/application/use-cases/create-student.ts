import { Either, left, right } from '@/core/either'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { IStudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'

interface CreateStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type CreateStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>

@Injectable()
export class CreateStudentUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateStudentUseCaseRequest): Promise<CreateStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const student = Student.create({ name, email, password: passwordHash })

    await this.studentRepository.create(student)

    return right({ student })
  }
}
