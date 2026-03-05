import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class AttachmentPresenter {
  static toHTTP(attachment: Attachment) {
    const { id, title, url } = attachment

    return {
      id: id.toString(),
      title,
      url,
    }
  }
}
