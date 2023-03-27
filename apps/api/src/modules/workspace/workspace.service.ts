import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Transform } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'
import { Invitation, Member, MemberRole, User, Workspace } from 'database'
import { normalizeString } from 'src/utils/normalize-string'
import { DatabaseService } from '../database/database.service'
import { Emailer } from '../notification/emailer'
import { CreateWorkspaceDTO } from './dtos/create-workspace.dto'
import { InviteGuestsToWorkspaceDTO } from './dtos/invite-guests-to-workspace.dto'
import { UpdateWorkspaceDTO } from './dtos/update-workspace.dto'
import { INVITATION_JWT_SERVICE } from './invitation-jwt.module'
const nanoid = require('nanoid')

export class JWTInvitationClaimsDTO {
  @Transform((val) => normalizeString(val.value || ''))
  @IsEmail()
  email: string

  @IsString()
  workspaceId: string
}

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly emailer: Emailer,
    private readonly configService: ConfigService,
    @Inject(INVITATION_JWT_SERVICE)
    private readonly jwtService: JwtService
  ) {}

  async createWorkspace(input: {
    dto: CreateWorkspaceDTO
    user: Pick<User, 'id'>
  }) {
    const workspace = await this.dbService.workspace.create({
      data: {
        id: nanoid.nanoid(),
        name: input.dto.name,
        description: input.dto.description,
        members: {
          create: {
            role: MemberRole.OWNER,
            userId: input.user.id,
          },
        },
      },
    })

    return {
      workspaceId: workspace.id,
    }
  }

  async updateWorkspace(input: {
    dto: UpdateWorkspaceDTO
    workspace: Workspace
  }) {
    await this.dbService.workspace.update({
      where: {
        id: input.workspace.id,
      },
      data: input.dto,
    })

    return {
      success: true,
    }
  }

  async inviteToWorkspace(input: {
    dto: InviteGuestsToWorkspaceDTO
    user: User
    workspace: Workspace
  }) {
    const invitationsToInsert = input.dto.invitations.map(({ email }) => {
      return {
        email,
        role: MemberRole.MEMBER,
        workspaceId: input.workspace.id,
      }
    })

    const invitations = await this.dbService.$transaction(
      invitationsToInsert.map((invitation) => {
        return this.dbService.invitation.create({
          data: {
            ...invitation,
            id: nanoid.nanoid(),
            invitedById: input.user.id,
          },
        })
      })
    )

    await this.emailer.sendBulk(
      'workspaceInvitation',
      invitations.map((invitation) => {
        const url = `${this.configService.get(
          'DASHBOARD_APP_URL'
        )}/invitation/${invitation.id}`

        return {
          email: invitation.email,
          url,
        }
      })
    )

    return {
      invitations: invitations.map((ele) => ({ id: ele.id })),
    }
  }

  async acceptInvitation(input: { invitation: Invitation; user: User }) {
    let memberId: number

    console.log('user', {
      workspaceId: input.invitation.workspaceId,
      role: input.invitation.role,
      invitationAcceptedAt: new Date(),
      userId: input.user.id,
    })

    await this.dbService.$transaction(async (db) => {
      await db.invitation.delete({
        where: {
          id: input.invitation.id,
        },
      })

      const member = await db.member.create({
        select: {
          id: true,
          workspace: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        data: {
          workspaceId: input.invitation.workspaceId,
          role: input.invitation.role,
          invitationAcceptedAt: new Date(),
          userId: input.user.id,
        },
      })

      memberId = member.id
    })

    return {
      memberId,
    }
  }

  async removeInvitation(input: { invitation: Invitation }) {
    await this.dbService.invitation.delete({
      where: {
        id: input.invitation.id,
      },
    })

    return {
      success: true,
    }
  }

  async removeMember(input: { member: Member }) {
    await this.dbService.member.delete({
      where: {
        id: input.member.id,
      },
    })

    return {
      success: true,
    }
  }

  async listWorkspaces(input: { user: User }) {
    return await this.dbService.workspace.findMany({
      where: {
        members: {
          some: {
            userId: input.user.id,
          },
        },
      },
    })
  }

  async listInvitations(input: { workspace: Workspace }) {
    return await this.dbService.invitation.findMany({
      where: {
        workspaceId: input.workspace.id,
      },
    })
  }

  async retrieveInvitation(input: { workspace: Workspace }) {
    return await this.dbService.invitation.findMany({
      where: {
        workspaceId: input.workspace.id,
      },
    })
  }

  async listMembers(input: { workspace: Workspace }) {
    return await this.dbService.member.findMany({
      select: {
        role: true,
        user: {
          select: {
            avatar: true,
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      where: {
        workspaceId: input.workspace.id,
      },
    })
  }
}
