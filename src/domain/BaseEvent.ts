export abstract class BaseEvent {
  protected constructor(private aggregate: string) {}

  public getEventAggregate(): string {
    return this.aggregate;
  }
}
