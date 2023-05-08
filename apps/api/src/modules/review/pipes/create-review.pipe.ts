import { CreateReviewDTO } from '../dtos/create-review.dto'
import { HttpService } from '@nestjs/axios'
import {
  BadRequestException,
  HttpServer,
  HttpStatus,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { firstValueFrom } from 'rxjs'
import { AppError } from 'src/common/error'
import { PresignedFilePostTokenClaimsDTO } from 'src/modules/file/dtos/presigned-file-post-token-claims.dto'
import { FILE_JWT_SERVICE } from 'src/modules/file/file-jwt.module'
import {
  IObjectMetadata,
  S3Provider,
} from 'src/modules/file/providers/s3.provider'

export type CreateReviewPipeOutput =
  | {
      title: string
      type: 'FILE'
      file: {
        claims: PresignedFilePostTokenClaimsDTO
        objectMetadata: IObjectMetadata
      }
    }
  | {
      title: string
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

        const objectMetadata = await this.s3.getMetadataObject(claims.storedKey)

        if (!objectMetadata.exists) {
          throw new AppError({
            code: 'file_not_found',
            description: 'The file was not found',
            status: HttpStatus.NOT_FOUND,
          })
        }

        return {
          title: dto.title,
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
          title: dto.title,
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
