import type { UniqueEntityId } from '../entities/unique-entity-id'

// Para criação de eventos de domínio
export interface DomainEvent {
  ocurredAt: Date
  getAggregateId: () => UniqueEntityId
}
