import { Either, left, right } from '@/core/either'
import { IAttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { InvalidAttachmentTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachments-type'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'

interface UploadAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

@Injectable()
export class UploadAttachmentUseCase {
  constructor(
    private attachmentRepository: IAttachmentsRepository,
    // private uploader: IUploader,
  ) {}

  async execute({
    fileName,
    fileType,
    // body,
  }: UploadAttachmentUseCaseRequest): Promise<UploadAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError())
    }

    // const { url } = await this.uploader.upload({
    //   fileName,
    //   fileType,
    //   body,
    // })

    const attachment = Attachment.create({
      title: fileName,
      url: 'random-uuid',
    })

    await this.attachmentRepository.create(attachment)

    return right({ attachment })
  }
}
