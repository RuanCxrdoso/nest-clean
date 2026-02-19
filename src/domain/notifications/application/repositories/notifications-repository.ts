import type { Notification } from '../../enterprise/entities/notification.js'

export interface INotificationsRepository {
  create: (notification: Notification) => Promise<Notification>
  save: (notification: Notification) => Promise<void>
  findById: (id: string) => Promise<Notification | null>
}
