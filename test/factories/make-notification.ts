import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import {
  Notification,
  type NotificationProps,
} from '@/domain/notifications/enterprise/entities/notification.js'
import { faker } from '@faker-js/faker'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(3),
      content: faker.lorem.sentence(8),
      ...override,
    },
    id,
  )

  return notification
}
