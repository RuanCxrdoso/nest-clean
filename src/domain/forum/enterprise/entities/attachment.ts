import { Entities } from '@/core/entities/entities.js'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.js'

export interface AttachmentProps {
  title: string
  link: string
}

export class Attachment extends Entities<AttachmentProps> {
  get title() {
    return this.props.title
  }

  get link() {
    return this.props.link
  }

  static create(props: AttachmentProps, id?: UniqueEntityId) {
    const attachment = new Attachment(props, id)

    return attachment
  }
}
