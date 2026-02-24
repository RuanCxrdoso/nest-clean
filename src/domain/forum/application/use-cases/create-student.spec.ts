import { CreateStudentUseCase } from '@/domain/forum/application/use-cases/create-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { MakeStudent } from 'test/factories/make-student'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let studentRepository: InMemoryStudentRepository
let hashGenerator: FakeHasher
let sut: CreateStudentUseCase

describe('CreateStudentUseCase unit tests', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentRepository()
    hashGenerator = new FakeHasher()
    sut = new CreateStudentUseCase(studentRepository, hashGenerator)
  })

  it('should be able to createa a student', async () => {
    const student = MakeStudent({
      name: 'Neymar da Silva Santos Jr',
    })

    const result = await sut.execute(student)

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      student: studentRepository.items[0],
    })
  })

  it('should hash student password', async () => {
    const student = MakeStudent({
      password: 'password',
    })

    const result = await sut.execute(student)
    const hashedPassword = await hashGenerator.hash('password')

    expect(result.isRight()).toBeTruthy()
    expect(studentRepository.items[0].password).toEqual(hashedPassword)
  })
})
