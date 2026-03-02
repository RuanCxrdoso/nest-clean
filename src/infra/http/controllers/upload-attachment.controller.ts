import { UploadAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(private uploadAttachmentUseCase: UploadAttachmentUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2mb
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log('File uploaded ===> ', file)
    const { filename: fileName, buffer: body, mimetype: fileType } = file

    const result = await this.uploadAttachmentUseCase.execute({
      fileName,
      fileType,
      body,
    })

    if (result.isLeft()) {
      throw new BadRequestException({
        message: result.value.message,
      })
    }

    const { id } = result.value.attachment

    return {
      id,
    }
  }
}
