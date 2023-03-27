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
import { MemberParamDTO } from '../dtos/member-param.dto'
import { WORKSPACE_REQUEST_KEY } from './workspace-member-role.guard'

export const MEMBER_REQUEST_KEY = 'member'

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(private readonly dbService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const dto = plainToInstance(MemberParamDTO, request.params)

    try {
      await validateOrReject(dto)
    } catch (err) {
      throw new BadRequestException(err)
    }

    const workspace: Workspace = request[WORKSPACE_REQUEST_KEY]

    const member = await this.dbService.member.findFirst({
      where: {
        workspaceId: workspace.id,
        id: dto.memberId,
      },
    })

    if (!member) {
      throw new NotFoundException(
        new AppError({
          code: 'not_found_member',
          description: `Workspace not found`,
          status: HttpStatus.NOT_FOUND,
        })
      )
    }

    request[MEMBER_REQUEST_KEY] = member

    return true
  }
}
