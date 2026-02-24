import type { Student } from '../../enterprise/entities/student.js'

export abstract class IStudentRepository {
  abstract create(student: Student): Promise<void>
  abstract findByEmail(email: string): Promise<Student | null>
}
