import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { USER_REQUEST_KEY } from '../guards/user.guard'

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    return request[USER_REQUEST_KEY]
  }
)
