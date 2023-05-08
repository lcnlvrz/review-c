import { CreateThreadDTO } from '../dtos/start-thread.dto'
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { AppError } from 'src/common/error'
import { PresignedFilePostTokenClaimsDTO } from 'src/modules/file/dtos/presigned-file-post-token-claims.dto'
import { FILE_JWT_SERVICE } from 'src/modules/file/file-jwt.module'
import { S3Provider } from 'src/modules/file/providers/s3.provider'

export type StartReviewThreadPipeOutput = Awaited<
  ReturnType<(typeof StartReviewThreadPipe)['prototype']['transform']>
>

@Injectable()
export class StartReviewThreadPipe implements PipeTransform {
  constructor(
    @Inject(FILE_JWT_SERVICE)
    private readonly jwtService: JwtService,
    private readonly s3Service: S3Provider
  ) {}

  async transform(body: any) {
    const dto = plainToInstance(CreateThreadDTO, body)

    try {
      await validateOrReject(dto)
    } catch (err) {
      throw new BadRequestException(err)
    }

    const fileTokenClaims: Array<
      PresignedFilePostTokenClaimsDTO & {
        size: number
      }
    > = []

    for (const token of dto.files) {
      try {
        const claims = this.jwtService.verify(token)

        const tokenClaims = plainToInstance(
          PresignedFilePostTokenClaimsDTO,
          claims
        )

        await validateOrReject(tokenClaims)

        const fileMetadata = await this.s3Service.getMetadataObject(
          tokenClaims.storedKey
        )

        if (!fileMetadata.exists) {
          throw new NotFoundException(
            new AppError({
              code: 'file_not_found',
              description: `File with key ${tokenClaims.storedKey} not found`,
              status: HttpStatus.NOT_FOUND,
            })
          )
        }

        fileTokenClaims.push({
          ...tokenClaims,
          size: fileMetadata.metadata.size,
        })
      } catch (err) {
        console.log('err', err)
        this.throwUnauthorizedFileToken()
      }
    }

    return {
      ...dto,
      files: fileTokenClaims,
    }
  }

  private throwUnauthorizedFileToken() {
    throw new UnauthorizedException(
      new AppError({
        code: 'invalid_file_token',
        description: `There is an invalid file token in the request`,
        status: HttpStatus.UNAUTHORIZED,
      })
    )
  }
}
