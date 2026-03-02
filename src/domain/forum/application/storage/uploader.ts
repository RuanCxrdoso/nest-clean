interface File {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class IUploader {
  abstract upload(file: File): Promise<{ url: string }>
}
