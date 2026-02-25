import type { INotificationsRepository } from '@/domain/notifications/application/repositories/notifications-repository'
import type { Notification } from '@/domain/notifications/enterprise/entities/notification'

export class InMemoryNotificationsRepository implements INotificationsRepository {
  public items: Notification[] = []

  async create(notification: Notification) {
    this.items.push(notification)

    return notification
  }

  async save(notification: Notification) {
    const notificationIndex = this.items.findIndex(
      (item) => item.id.toString() === notification.id.toString(),
    )

    this.items[notificationIndex] = notification

    return
  }

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id)

    if (!notification) return null

    return notification
  }
}
