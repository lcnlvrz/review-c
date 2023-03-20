import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Invitation, MemberRole, User, Workspace } from 'database'
import { DatabaseService } from '../database/database.service'
import { Emailer } from '../notification/emailer'
import { CreateWorkspaceDTO } from './dtos/create-workspace.dto'
import { InviteGuestToWorkspaceDTO } from './dtos/invite-guest-to-workspace.dto'
import { UpdateWorkspaceDTO } from './dtos/update-workspace.dto'
import { INVITATION_JWT_SERVICE } from './invitation-jwt.module'

export interface IJWTInvitationClaims {
  sub: string
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

  async createWorkspace(input: { dto: CreateWorkspaceDTO; user: User }) {
    const workspace = await this.dbService.workspace.create({
      data: {
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
    dto: InviteGuestToWorkspaceDTO
    user: User
    workspace: Workspace
  }) {
    const claims: IJWTInvitationClaims = {
      sub: input.dto.email,
    }

    const token = this.jwtService.sign(claims)

    const invitation = await this.dbService.invitation.create({
      data: {
        role: MemberRole.MEMBER,
        email: input.dto.email,
        workspaceId: input.workspace.id,
        token,
      },
    })

    console.log('this.emailer', this.emailer)

    await this.emailer.send('workspaceInvitation', {
      url: `${this.configService.get(
        'DASHBOARD_APP_URL'
      )}/register/invitation?token=${token}`,
    })

    return {
      invitationId: invitation.id,
    }
  }

  async acceptInvitation(input: { invitation: Invitation; user: User }) {
    let memberId: number

    await this.dbService.$transaction(async (db) => {
      await db.invitation.delete({
        where: {
          id: input.invitation.id,
        },
      })

      const member = await db.member.create({
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

  async listWorkspaces(input: { user: User }) {
    return await this.dbService.workspace.findMany({
      where: {
        members: {
          some: {
            userId: input.user.id,
          },
        },
      },
      include: {
        members: true,
        invitations: true,
      },
    })
  }
}
