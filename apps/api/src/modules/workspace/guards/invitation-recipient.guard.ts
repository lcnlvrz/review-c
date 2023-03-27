import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { User } from 'database'
import { Request } from 'express'
import { USER_REQUEST_KEY } from 'src/modules/auth/guards/user.guard'
import { DatabaseService } from 'src/modules/database/database.service'
import { InvitationParamDTO } from '../dtos/invitation-param.dto'
import {
  INVITATION_NOT_FOUND_ERR,
  INVITATION_REQUEST_KEY,
} from './invitation.guard'

@Injectable()
export class InvitationRecipientGuard implements CanActivate {
  constructor(private readonly dbService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const dto = plainToInstance(InvitationParamDTO, request.params)

    try {
      await validateOrReject(dto)
    } catch (err) {
      throw new BadRequestException(err)
    }

    const user: User = request[USER_REQUEST_KEY]

    const invitation = await this.dbService.invitation.findFirst({
      select: {
        email: true,
        id: true,
        role: true,
        createdAt: true,
        invitedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        invitedById: true,
        workspaceId: true,
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        email: user.email,
        id: dto.invitationId,
      },
    })

    if (!invitation) {
      throw new NotFoundException(INVITATION_NOT_FOUND_ERR)
    }

    request[INVITATION_REQUEST_KEY] = invitation

    return true
  }
}
