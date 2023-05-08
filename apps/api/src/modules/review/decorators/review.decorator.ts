import { REVIEW_REQUEST_KEY } from '../guards/review.guard'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const ReqReview = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    return request[REVIEW_REQUEST_KEY]
  }
)
