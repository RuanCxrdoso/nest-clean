import { AuthStudentUseCase } from '@/domain/forum/application/use-cases/auth-student'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { MakeStudent } from 'test/factories/make-student'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let studentRepository: InMemoryStudentRepository
let encrypter: FakeEncrypter
let hashComparer: FakeHasher
let sut: AuthStudentUseCase

describe('AuthStudentUseCase unit tests', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    encrypter = new FakeEncrypter()
    hashComparer = new FakeHasher()
    sut = new AuthStudentUseCase(studentRepository, hashComparer, encrypter)
  })

  it('should be able to auth student', async () => {
    const student = MakeStudent({
      password: await hashComparer.hash('123456'),
    })

    await studentRepository.create(student)

    const result = await sut.execute({
      email: student.email,
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: JSON.stringify({ sub: student.id.toString() }),
      }),
    )
  })
})
