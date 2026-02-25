import type { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { Entities } from './entities'

export abstract class AggregateRoot<Props> extends Entities<Props> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents() {
    return this._domainEvents
  }

  // Adiciono um evento de dominio na lista e marco o agregado como possível lançador de eventos ainda pendentes (aguarda confirmação do DB)
  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
    DomainEvents.markAggregateForDispatch(this)
  }

  public clearEvents() {
    this._domainEvents = []
  }
}
