import { Entities } from '@/core/entities/entities.js'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.js'

interface StudentProps {
  name: string
}

export class Student extends Entities<StudentProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.name = name
  }

  static create(props: StudentProps, id?: UniqueEntityId) {
    const student = new Student(props, id)

    return student
  }
}
