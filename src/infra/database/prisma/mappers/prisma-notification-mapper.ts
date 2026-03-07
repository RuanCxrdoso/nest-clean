import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notifications/enterprise/entities/notification'
import { Notification as PrismaNotification } from 'generated/prisma/client'
import { NotificationUncheckedCreateInput } from 'generated/prisma/models'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification) {
    return Notification.create(
      {
        recipientId: new UniqueEntityId(raw.recipientId),
        title: raw.title,
        content: raw.content,
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    }
  }
}
