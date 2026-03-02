import { IUploader } from '@/domain/forum/application/storage/uploader'
import { randomUUID } from 'crypto'

interface Upload {
  fileName: string
  url: string
}

export class Uploader implements IUploader {
  private file: Upload[] = []

  async upload({ fileName }: { fileName: string }): Promise<{ url: string }> {
    const url = randomUUID()

    this.file.push({ fileName, url })

    return { url }
  }
}
