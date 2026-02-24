import type { Student } from '../../enterprise/entities/student.js'

export abstract class IStudentRepository {
  abstract create: (student: Student) => Promise<void>
  abstract findByEmail: (id: string) => Promise<Student | null>
}
