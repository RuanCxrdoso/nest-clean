import { Entities } from '@/core/entities/entities'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface InstructorProps {
  name: string
}

export class Instructor extends Entities<InstructorProps> {
  get name() {
    return this.props.name
  }

  static create(props: InstructorProps, id?: UniqueEntityId) {
    const instructor = new Instructor(props, id)

    return instructor
  }
}
