export class UUIDValidate {
  public uuid: string
  public verified: boolean

  constructor(uuid: string, verified: boolean) {
    this.uuid = uuid
    this.verified = verified
  }
}
