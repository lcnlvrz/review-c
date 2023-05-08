import { WorkspaceParamDTO } from '../dtos/workspace-param.dto'
import { MEMBER_REQUEST_KEY } from './member.guard'
import { WORKSPACE_REQUEST_KEY } from './workspace-member-role.guard'
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { User } from 'database'
import { Request } from 'express'
import { AppError } from 'src/common/error'
import { USER_REQUEST_KEY } from 'src/modules/auth/guards/user.guard'
import { DatabaseService } from 'src/modules/database/database.service'

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private readonly dbService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const user: User = request[USER_REQUEST_KEY]

    const dto = plainToInstance(WorkspaceParamDTO, request.params)

    try {
      await validateOrReject(dto)
    } catch (err) {
      throw new BadRequestException(err)
    }

    const workspace = await this.dbService.workspace.findFirst({
      where: {
        id: dto.workspaceId,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        members: {
          where: {
            userId: user.id,
          },
        },
      },
    })

    console.log('workspace', workspace)

    if (!workspace) {
      throw new NotFoundException(
        new AppError({
          code: 'not_found_workspace',
          description: `Workspace not found`,
          status: HttpStatus.NOT_FOUND,
        })
      )
    }

    request[WORKSPACE_REQUEST_KEY] = workspace

    const [member] = workspace.members

    request[MEMBER_REQUEST_KEY] = member

    return true
  }
}
