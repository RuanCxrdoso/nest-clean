import { Either, left, right } from '@/core/either'
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { IStudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { InvalidCredentialsError } from '@/domain/forum/application/use-cases/errors/invalid-credentials-error'
import { Injectable } from '@nestjs/common'

interface AuthStudentUseCaseRequest {
  email: string
  password: string
}

type AuthStudentUseCaseResponse = Either<
  InvalidCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthStudentUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthStudentUseCaseRequest): Promise<AuthStudentUseCaseResponse> {
    const student = await this.studentRepository.findByEmail(email)

    if (!student) {
      return left(new InvalidCredentialsError())
    }

    const isCorrectlyPassoword = await this.hashComparer.compare(
      password,
      student.password,
    )

    if (!isCorrectlyPassoword) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({ accessToken })
  }
}
