import { right, type Either } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { INotificationsRepository } from '../repositories/notifications-repository'
import { Injectable } from '@nestjs/common'

interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: INotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    })

    await this.notificationsRepository.create(notification)

    return right({ notification })
  }
}
