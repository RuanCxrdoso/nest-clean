import type { UniqueEntityId } from '../entities/unique-entity-id.js'

// Para criação de eventos de domínio
export interface DomainEvent {
  ocurredAt: Date
  getAggregateId: () => UniqueEntityId
}
