import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { Invitation, User, Workspace } from 'database'
import { ReqUser } from '../auth/decorators/user.decorator'
import { UserGuard } from '../auth/guards/user.guard'
import { ReqInvitation } from './decorators/invitation.decorator'
import { RolesAllowed } from './decorators/roles-allowed.decorator'
import { ReqWorkspace } from './decorators/workspace.decorator'
import { CreateWorkspaceDTO } from './dtos/create-workspace.dto'
import {
  IInviteGuestsToWorkspaceDTO,
  InviteGuestsToWorkspaceDTO,
} from './dtos/invite-guests-to-workspace.dto'
import { UpdateWorkspaceDTO } from './dtos/update-workspace.dto'
import { BulkInvitationsGuard } from './guards/bulk-invitations.guard'
import { InvitationGuard } from './guards/invitation.guard'
import { WorkspaceInvitationTokenGuard } from './guards/workspace-invitation-token.guard'
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
  async retrieveWorkspace(@ReqWorkspace() workspace: Workspace) {
    return workspace
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
  @RolesAllowed('OWNER')
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

  @Post('/invitation/:invitationId/accept')
  @UseGuards(UserGuard, WorkspaceInvitationTokenGuard)
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
  @RolesAllowed('OWNER')
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

  @Post(':workspaceId/invitation')
  @RolesAllowed('OWNER')
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
    console.log('typeof dto', typeof dto)

    return await this.workspaceService.inviteToWorkspace({
      dto,
      user,
      workspace,
    })
  }
}
