import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { Workspace } from 'database'
import { AppError } from 'src/common/error'
import { DatabaseService } from 'src/modules/database/database.service'
import { Request } from 'express'
import { InviteGuestsToWorkspaceDTO } from '../dtos/invite-guests-to-workspace.dto'
import { WORKSPACE_REQUEST_KEY } from './workspace-member-role.guard'

@Injectable()
export class BulkInvitationsGuard implements CanActivate {
  constructor(private readonly dbService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const workspace: Workspace = request[WORKSPACE_REQUEST_KEY]

    const dto = plainToInstance(InviteGuestsToWorkspaceDTO, request.body)

    try {
      await validateOrReject(dto)
    } catch (err) {
      throw new BadRequestException(err)
    }

    request.body = dto

    const members = await this.dbService.member.findMany({
      select: {
        id: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      where: {
        workspaceId: workspace.id,
        user: {
          email: {
            in: dto.invitations.map((invitation) => invitation.email),
          },
        },
      },
    })

    if (members.length) {
      throw new BadRequestException(
        new AppError<{ emails: string[] }>({
          code: 'members_already_exist',
          description:
            'There are already members with the same email address in the same workspace.',
          status: HttpStatus.CONFLICT,
          emails: members.map((member) => member.user.email),
        })
      )
    }

    const invitations = await this.dbService.invitation.findMany({
      select: {
        id: true,
        email: true,
      },
      where: {
        workspaceId: workspace.id,
        email: {
          in: dto.invitations.map((invitation) => invitation.email),
        },
      },
    })

    if (invitations.length) {
      throw new BadRequestException(
        new AppError<{ emails: string[] }>({
          code: 'invitations_already_exist',
          description:
            'There are already invitations with the same email address in the same workspace.',
          status: HttpStatus.CONFLICT,
          emails: invitations.map((invitation) => invitation.email),
        })
      )
    }

    return true
  }
}
