import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { NotificationModule } from '../notification/notification.module'
import { InvitationJWTModule } from './invitation-jwt.module'
import { WorkspaceController } from './workspace.controller'
import { WorkspaceService } from './workspace.service'

@Module({
  imports: [AuthModule, NotificationModule, InvitationJWTModule],
  providers: [WorkspaceService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
