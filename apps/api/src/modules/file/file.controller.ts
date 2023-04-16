import { Body, Controller, Post } from '@nestjs/common'
import { GeneratePresignedPostDTO } from './dtos/generate-presigned-post.dto'
import { FileService } from './file.service'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('presigned')
  async presignedFile(@Body() dto: GeneratePresignedPostDTO) {
    return await this.fileService.generatePresignedPOST(dto)
  }
}
