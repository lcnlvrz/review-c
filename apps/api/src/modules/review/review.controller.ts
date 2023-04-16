import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { User, Workspace } from 'database'
import { ReqUser } from '../auth/decorators/user.decorator'
import { UserGuard } from '../auth/guards/user.guard'
import {
  CreateReviewPipe,
  CreateReviewPipeOutput,
} from './pipes/create-review.pipe'
import { ReviewService } from './review.service'
import { WorkspaceGuard } from '../workspace/guards/workspace.guard'
import { ReqWorkspace } from '../workspace/decorators/workspace.decorator'

@Controller('workspace')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':workspaceId/review')
  @UseGuards(UserGuard, WorkspaceGuard)
  async createReview(
    @Body(CreateReviewPipe) dto: CreateReviewPipeOutput,
    @ReqUser() user: User,
    @ReqWorkspace() workspace: Workspace
  ) {
    return await this.reviewService.createReview(workspace, user, dto)
  }

  @Get(':workspaceId/review')
  @UseGuards(UserGuard, WorkspaceGuard)
  async listReviews(@ReqWorkspace() workspace: Workspace) {
    return await this.reviewService.listReviews(workspace)
  }
}
