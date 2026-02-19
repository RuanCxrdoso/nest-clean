import { UniqueEntityId } from './unique-entity-id.js'

export abstract class Entities<Props> {
  private _id: UniqueEntityId
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  public equals(entitiy: Entities<unknown>) {
    if (entitiy === this) {
      return true
    }

    if (entitiy.id === this._id) {
      return true
    }

    return false
  }
}
