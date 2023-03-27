import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Member, MemberRole } from 'database'
import { Request } from 'express'
import { AppError } from 'src/common/error'
import { ROLES_ALLOWED_METADATA_KEY } from '../decorators/roles-allowed.decorator'
import { MEMBER_REQUEST_KEY } from './member.guard'

export const WORKSPACE_REQUEST_KEY = 'workspace'

@Injectable()
export class WorkspaceMemberRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const member: Member = request[MEMBER_REQUEST_KEY]

    const rolesAllowed = this.reflector.get<MemberRole[]>(
      ROLES_ALLOWED_METADATA_KEY,
      context.getHandler()
    )

    if (!rolesAllowed.includes(member.role)) {
      throw new ForbiddenException(
        new AppError({
          code: 'invalid_member_role',
          description: `Invalid member role`,
          status: HttpStatus.FORBIDDEN,
        })
      )
    }

    return true
  }
}
