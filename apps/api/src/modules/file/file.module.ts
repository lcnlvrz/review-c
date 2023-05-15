import { FileJWTModule } from './file-jwt.module'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { S3Provider } from './providers/s3.provider'
import { Module } from '@nestjs/common'

@Module({
  imports: [FileJWTModule],
  providers: [S3Provider, FileService],
  controllers: [FileController],
  exports: [FileJWTModule, S3Provider, FileService],
})
export class FileModule {}
