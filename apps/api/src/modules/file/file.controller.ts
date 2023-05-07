import { GeneratePresignedPostDTO } from './dtos/generate-presigned-post.dto'
import { FileService } from './file.service'
import { Body, Controller, Post } from '@nestjs/common'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('presigned')
  async presignedFile(@Body() dto: GeneratePresignedPostDTO) {
    return await this.fileService.generatePresignedPOST(dto)
  }
}
