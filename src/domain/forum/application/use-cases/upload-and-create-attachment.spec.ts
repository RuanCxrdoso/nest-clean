import { IUploader } from '@/domain/forum/application/storage/uploader'
import { UploadAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { Uploader } from 'test/storage/uploader'

let attachmentRepository: InMemoryAttachmentsRepository
let uploader: IUploader
let sut: UploadAttachmentUseCase

describe('UploadAndCreateAttachment unit tests', () => {
  beforeEach(() => {
    attachmentRepository = new InMemoryAttachmentsRepository()
    uploader = new Uploader()
    sut = new UploadAttachmentUseCase(attachmentRepository, uploader)
  })

  it('should be able to upload and create a attachment', async () => {
    const file = {
      fileName: 'image',
      fileType: 'image/jpeg',
      body: Buffer.from(''),
    }

    const result = await sut.execute(file)

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      attachment: expect.objectContaining({
        title: file.fileName,
      }),
    })
    expect(result.value).toEqual({
      attachment: attachmentRepository.items[0],
    })
  })
})
