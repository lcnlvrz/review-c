import { GeneratePresignedPostDTO } from './dtos/generate-presigned-post.dto'
import { PresignedFilePostTokenClaimsDTO } from './dtos/presigned-file-post-token-claims.dto'
import { FILE_JWT_SERVICE } from './file-jwt.module'
import { S3Provider } from './providers/s3.provider'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { POST_PRESIGNED_URL_EXPIRATION_SECONDS } from 'src/constants/file'
import { v4 as uuid } from 'uuid'

const sanitizeFilename = require('sanitize-filename')

@Injectable()
export class FileService {
  constructor(
    private readonly s3Service: S3Provider,
    @Inject(FILE_JWT_SERVICE)
    private readonly jwtService: JwtService
  ) {}

  async generatePresignedPOST(dto: GeneratePresignedPostDTO) {
    const storedKey = this.normalizeFilename(dto.filename)

    const presignedPOST = await this.s3Service.generatePresignedPostURL({
      contentType: dto.mimetype,
      expirationInSeconds: POST_PRESIGNED_URL_EXPIRATION_SECONDS,
      key: storedKey,
    })

    const claims: PresignedFilePostTokenClaimsDTO = {
      storedKey,
      originalFilename: dto.filename,
    }

    const token = this.jwtService.sign(claims)

    return {
      ...presignedPOST,
      token,
    }
  }

  private normalizeFilename(filename: string): string {
    return `${uuid()}-${sanitizeFilename(filename)}`.replace(/ /g, '')
  }
}
