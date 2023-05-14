import { AppError } from '../error'
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { Request } from 'express'
import { PresignedFilePostTokenClaimsDTO } from 'src/modules/file/dtos/presigned-file-post-token-claims.dto'
import { FILE_JWT_SERVICE } from 'src/modules/file/file-jwt.module'
import { S3Provider } from 'src/modules/file/providers/s3.provider'
import { AddMessageDTO } from 'src/modules/review/dtos/add-message.dto'

export type FileTokenClaims = PresignedFilePostTokenClaimsDTO & {
  size: number
}

export const FILE_TOKEN_CLAIMS_REQUEST_KEY = 'fileTokensClaims'

export const ReqFileTokensClaims = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    return request[FILE_TOKEN_CLAIMS_REQUEST_KEY]
  }
)

@Injectable()
export class FileTokensGuard implements CanActivate {
  constructor(
    @Inject(FILE_JWT_SERVICE)
    private readonly jwtService: JwtService,
    private readonly s3Service: S3Provider
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const dto = plainToInstance(AddMessageDTO, request.body)

    try {
      await validateOrReject(dto)
    } catch (err) {
      throw new BadRequestException(err)
    }

    const fileTokenClaims: FileTokenClaims[] = []

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
        this.throwUnauthorizedFileToken()
      }
    }

    request[FILE_TOKEN_CLAIMS_REQUEST_KEY] = fileTokenClaims

    return true
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
