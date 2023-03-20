import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { INVITATION_REQUEST_KEY } from '../guards/workspace-invitation-token.guard'

export const ReqInvitation = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    return request[INVITATION_REQUEST_KEY]
  }
)
