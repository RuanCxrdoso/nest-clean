import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { User } from 'generated/prisma/client'
import { UserUncheckedCreateInput } from 'generated/prisma/models'

export class PrismaStudentMapper {
  static toDomain(rawStudent: User): Student {
    const student = Student.create(
      {
        name: rawStudent.name,
        email: rawStudent.email,
        password: rawStudent.password,
      },
      new UniqueEntityId(rawStudent.id),
    )

    return student
  }

  static toPrisma(student: Student): UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }
}
