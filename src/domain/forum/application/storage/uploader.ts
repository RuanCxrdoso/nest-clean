export abstract class IUploader {
  abstract upload(file: {
    fileName: string
    fileType: string
    body: Buffer
  }): Promise<{ url: string }>
}
