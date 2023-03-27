import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { MEMBER_REQUEST_KEY } from '../guards/member.guard'

export const ReqMember = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    return request[MEMBER_REQUEST_KEY]
  }
)
