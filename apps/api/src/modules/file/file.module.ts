import { Module } from '@nestjs/common'
import { S3Provider } from './providers/s3.provider'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { FileJWTModule } from './file-jwt.module'

@Module({
  imports: [FileJWTModule],
  providers: [S3Provider, FileService],
  controllers: [FileController],
  exports: [FileJWTModule, S3Provider],
})
export class FileModule {}
