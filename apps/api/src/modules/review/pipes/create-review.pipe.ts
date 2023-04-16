import {
  BadRequestException,
  HttpServer,
  HttpStatus,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { CreateReviewDTO } from '../dtos/create-review.dto'
import { FILE_JWT_SERVICE } from 'src/modules/file/file-jwt.module'
import { JwtService } from '@nestjs/jwt'
import { PresignedFilePostTokenClaimsDTO } from 'src/modules/file/dtos/presigned-file-post-token-claims.dto'
import { AppError } from 'src/common/error'
import {
  IObjectMetadata,
  S3Provider,
} from 'src/modules/file/providers/s3.provider'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'

export type CreateReviewPipeOutput =
  | {
      type: 'FILE'
      file: {
        claims: PresignedFilePostTokenClaimsDTO
        objectMetadata: IObjectMetadata
      }
    }
  | {
      type: 'URL'
      url: string
    }

@Injectable()
export class CreateReviewPipe implements PipeTransform {
  constructor(
    @Inject(FILE_JWT_SERVICE)
    private readonly jwtService: JwtService,
    private readonly s3: S3Provider,
    private readonly httpService: HttpService
  ) {}

  async transform(value: any): Promise<CreateReviewPipeOutput> {
    const dto = plainToInstance(CreateReviewDTO, value)

    try {
      await validateOrReject(dto)
    } catch (err) {
      throw new BadRequestException(err)
    }

    switch (dto.type) {
      case 'FILE': {
        let payload: any

        console.log('dto.file', dto.file)

        try {
          payload = this.jwtService.verify(dto.file)
        } catch (err) {
          throw this.unauthorizedFileToken()
        }

        const claims = plainToInstance(PresignedFilePostTokenClaimsDTO, payload)

        try {
          await validateOrReject(claims)
        } catch (err) {
          throw this.unauthorizedFileToken()
        }

        console.log('claims.keyStored', claims.keyStored)

        const objectMetadata = await this.s3.getMetadataObject(claims.keyStored)
        console.log('objectMetadata', objectMetadata)

        if (!objectMetadata.exists) {
          throw new AppError({
            code: 'file_not_found',
            description: 'The file was not found',
            status: HttpStatus.NOT_FOUND,
          })
        }

        return {
          type: 'FILE',
          file: {
            claims,
            objectMetadata: objectMetadata.metadata,
          },
        }
      }

      case 'URL': {
        try {
          await firstValueFrom(this.httpService.get(dto.url))
        } catch (err) {
          throw new AppError({
            code: 'url_not_found',
            description: 'The URL was not found',
            status: HttpStatus.NOT_FOUND,
          })
        }

        return {
          type: 'URL',
          url: dto.url,
        }
      }
    }
  }

  private unauthorizedFileToken() {
    return new AppError({
      code: 'invalid_file_token',
      status: HttpStatus.UNAUTHORIZED,
      description: 'The file token is invalid',
    })
  }
}
