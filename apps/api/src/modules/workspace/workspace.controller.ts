import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { Invitation, Member, User, Workspace } from 'database'
import { ReqUser } from '../auth/decorators/user.decorator'
import { UserGuard } from '../auth/guards/user.guard'
import { ReqInvitation } from './decorators/invitation.decorator'
import { ReqMember } from './decorators/member.decorator'
import { RolesAllowed } from './decorators/roles-allowed.decorator'
import { ReqWorkspace } from './decorators/workspace.decorator'
import { CreateWorkspaceDTO } from './dtos/create-workspace.dto'
import { IInviteGuestsToWorkspaceDTO } from './dtos/invite-guests-to-workspace.dto'
import { UpdateWorkspaceDTO } from './dtos/update-workspace.dto'
import { BulkInvitationsGuard } from './guards/bulk-invitations.guard'
import { InvitationRecipientGuard } from './guards/invitation-recipient.guard'
import { InvitationGuard } from './guards/invitation.guard'
import { MemberGuard } from './guards/member.guard'
import { WorkspaceMemberRoleGuard } from './guards/workspace-member-role.guard'
import { WorkspaceGuard } from './guards/workspace.guard'
import { WorkspaceService } from './workspace.service'

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(UserGuard)
  async createWorkspace(
    @Body() dto: CreateWorkspaceDTO,
    @ReqUser() user: User
  ) {
    return await this.workspaceService.createWorkspace({
      dto,
      user,
    })
  }

  @Get('me')
  @UseGuards(UserGuard)
  async listWorkspaces(@ReqUser() user: User) {
    const workspaces = await this.workspaceService.listWorkspaces({
      user,
    })

    return {
      workspaces,
    }
  }

  @Get(':workspaceId')
  @UseGuards(UserGuard, WorkspaceGuard)
  async retrieveWorkspace(
    @ReqWorkspace() workspace: Workspace,
    @ReqMember() member: Member
  ) {
    console.log('member', member)

    return {
      ...workspace,
      member,
    }
  }

  @Get(':workspaceId/member')
  @UseGuards(UserGuard, WorkspaceGuard)
  async listMembers(@ReqWorkspace() workspace: Workspace) {
    const members = await this.workspaceService.listMembers({
      workspace,
    })

    return {
      members,
    }
  }

  @Get('/:workspaceId/invitation')
  @UseGuards(UserGuard, WorkspaceGuard)
  async listInvitationsWorkspace(@ReqWorkspace() workspace: Workspace) {
    const invitations = await this.workspaceService.listInvitations({
      workspace,
    })

    return {
      invitations,
    }
  }

  @Put(':workspaceId')
  @RolesAllowed('ADMIN')
  @UseGuards(UserGuard, WorkspaceGuard, WorkspaceMemberRoleGuard)
  async updateWorkspace(
    @Body() dto: UpdateWorkspaceDTO,
    @ReqWorkspace() workspace: Workspace
  ) {
    return await this.workspaceService.updateWorkspace({
      dto,
      workspace,
    })
  }

  @Get('/invitation/:invitationId/check-recipient')
  @UseGuards(UserGuard, InvitationRecipientGuard)
  async checkInvitationRecipient(@ReqInvitation() invitation: Invitation) {
    return invitation
  }

  @Post('/invitation/:invitationId/accept')
  @UseGuards(UserGuard, InvitationRecipientGuard)
  async acceptInvitation(
    @ReqUser() user: User,
    @ReqInvitation() invitation: Invitation
  ) {
    return await this.workspaceService.acceptInvitation({
      invitation,
      user,
    })
  }

  @Delete(':workspaceId/invitation/:invitationId')
  @RolesAllowed('ADMIN')
  @UseGuards(
    UserGuard,
    WorkspaceGuard,
    WorkspaceMemberRoleGuard,
    InvitationGuard
  )
  async removeInvitation(@ReqInvitation() invitation: Invitation) {
    return await this.workspaceService.removeInvitation({
      invitation,
    })
  }

  @Delete(':workspaceId/member/:memberId')
  @RolesAllowed('ADMIN')
  @UseGuards(UserGuard, WorkspaceGuard, WorkspaceMemberRoleGuard, MemberGuard)
  async removeMember(@ReqMember() member: Member) {
    return await this.workspaceService.removeMember({
      member,
    })
  }

  @Post(':workspaceId/invitation')
  @RolesAllowed('ADMIN')
  @UseGuards(
    UserGuard,
    WorkspaceGuard,
    WorkspaceMemberRoleGuard,
    BulkInvitationsGuard
  )
  async inviteToWorkspace(
    @Body() dto: IInviteGuestsToWorkspaceDTO,
    @ReqUser() user: User,
    @ReqWorkspace() workspace: Workspace
  ) {
    return await this.workspaceService.inviteToWorkspace({
      dto,
      user,
      workspace,
    })
  }
}
