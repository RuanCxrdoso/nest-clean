import { left, right, type Either } from '@/core/either.js'
import type { INotificationsRepository } from '../repositories/notifications-repository.js'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error.js'
import { NotAllowedError } from '@/core/errors/not-allowed-error.js'

interface ReadNoticationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNoticationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: INotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNoticationUseCaseRequest): Promise<ReadNoticationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError())
    }

    notification.read()

    void this.notificationsRepository.save(notification)

    return right({})
  }
}
