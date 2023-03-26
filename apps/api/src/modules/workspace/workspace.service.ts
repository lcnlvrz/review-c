import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Invitation, MemberRole, User, Workspace } from 'database'
import { DatabaseService } from '../database/database.service'
import { Emailer } from '../notification/emailer'
import { CreateWorkspaceDTO } from './dtos/create-workspace.dto'
import { InviteGuestsToWorkspaceDTO } from './dtos/invite-guests-to-workspace.dto'
import { UpdateWorkspaceDTO } from './dtos/update-workspace.dto'
import { INVITATION_JWT_SERVICE } from './invitation-jwt.module'
const nanoid = require('nanoid')

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

  async createWorkspace(input: {
    dto: CreateWorkspaceDTO
    user: Pick<User, 'id'>
  }) {
    const workspace = await this.dbService.workspace.create({
      data: {
        nanoid: nanoid.nanoid(),
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
      const claims: IJWTInvitationClaims = {
        sub: email,
      }

      const token = this.jwtService.sign(claims)

      return {
        email,
        role: MemberRole.MEMBER,
        token,
        workspaceId: input.workspace.id,
      }
    })

    const invitations = await this.dbService.$transaction(
      invitationsToInsert.map((invitation) => {
        return this.dbService.invitation.create({
          data: invitation,
        })
      })
    )

    await this.emailer.sendBulk(
      'workspaceInvitation',
      invitations.map((invitation) => {
        return {
          email: invitation.email,
          url: `${this.configService.get(
            'DASHBOARD_APP_URL'
          )}/register/invitation?token=${invitation.token}`,
        }
      })
    )

    return {
      invitations: invitations.map((ele) => ({ id: ele.id })),
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
    })
  }

  async listInvitations(input: { workspace: Workspace }) {
    return await this.dbService.invitation.findMany({
      where: {
        workspaceId: input.workspace.id,
      },
    })
  }
}
