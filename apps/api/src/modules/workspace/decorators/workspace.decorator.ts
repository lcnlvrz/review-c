import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { WORKSPACE_REQUEST_KEY } from '../guards/workspace-member-role.guard'

export const ReqWorkspace = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    return request[WORKSPACE_REQUEST_KEY]
  }
)
