import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { Workspace } from 'database'
import { Request } from 'express'
import { AppError } from 'src/common/error'
import { DatabaseService } from 'src/modules/database/database.service'
import { InvitationParamDTO } from '../dtos/invitation-param.dto'
import { INVITATION_REQUEST_KEY } from './workspace-invitation-token.guard'
import { WORKSPACE_REQUEST_KEY } from './workspace-member-role.guard'

@Injectable()
export class InvitationGuard implements CanActivate {
  constructor(private readonly dbService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const dto = plainToInstance(InvitationParamDTO, request.params)

    try {
      await validateOrReject(dto)
    } catch (err) {
      throw new BadRequestException(err)
    }

    const workspace: Workspace = request[WORKSPACE_REQUEST_KEY]

    const invitation = await this.dbService.invitation.findFirst({
      where: {
        workspaceId: workspace.id,
        id: dto.invitationId,
      },
    })

    if (!invitation) {
      throw new NotFoundException(
        new AppError({
          code: 'not_found_invitation',
          description: `Workspace not found`,
          status: HttpStatus.NOT_FOUND,
        })
      )
    }

    request[INVITATION_REQUEST_KEY] = invitation

    return true
  }
}
