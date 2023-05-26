import { REVIEW_REQUEST_KEY } from './review.guard'
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { isURL } from 'class-validator'
import { Review } from 'database'
import { Request } from 'express'
import { AppError } from 'src/common/error'

@Injectable()
export class ReviewOriginGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const review: Review = request[REVIEW_REQUEST_KEY]

    if (review.type !== 'WEBSITE') {
      return true
    }

    const origin = request.headers.origin

    if (!origin || !isURL(origin)) {
      this.throwInvalidOrigin()
    }

    const requestURL = new URL(origin)
    const originalURL = new URL(review.website)

    if (requestURL.origin !== originalURL.origin) {
      this.throwInvalidOrigin()
    }

    return true
  }

  private throwInvalidOrigin() {
    throw new BadRequestException(
      new AppError({
        code: 'referer_header_invalid',
        description: `Referer header is invalid`,
        status: HttpStatus.BAD_REQUEST,
      })
    )
  }
}
