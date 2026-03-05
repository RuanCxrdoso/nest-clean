export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public equals(valueObject: ValueObject<unknown>) {
    if (valueObject === null || valueObject === undefined) return false

    if (valueObject.props === undefined) return false

    if (JSON.stringify(valueObject.props) === JSON.stringify(this.props))
      return true

    return false
  }
}
