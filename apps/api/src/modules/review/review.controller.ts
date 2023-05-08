import { ReqUser } from '../auth/decorators/user.decorator'
import { UserGuard } from '../auth/guards/user.guard'
import { ReqWorkspace } from '../workspace/decorators/workspace.decorator'
import { WorkspaceGuard } from '../workspace/guards/workspace.guard'
import { ReqReview } from './decorators/review.decorator'
import { ICreateThreadDTO } from './dtos/start-thread.dto'
import { ReviewGuard } from './guards/review.guard'
import {
  CreateReviewPipe,
  CreateReviewPipeOutput,
} from './pipes/create-review.pipe'
import {
  StartReviewThreadPipe,
  StartReviewThreadPipeOutput,
} from './pipes/start-review-thread.pipe'
import { ReviewService } from './review.service'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Options,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Review, User, Workspace } from 'database'

@Controller('workspace')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':workspaceId/review/:reviewId/thread')
  @UseGuards(UserGuard, WorkspaceGuard, ReviewGuard)
  async addThreadToReview(
    @Body(StartReviewThreadPipe) dto: StartReviewThreadPipeOutput,
    @ReqUser() user: User,
    @ReqWorkspace() workspace: Workspace,
    @ReqReview() review: Review
  ) {
    return await this.reviewService.startThread({
      dto,
      review,
      user,
      workspace,
    })
  }

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

  @Get(':workspaceId/review/:reviewId')
  @UseGuards(UserGuard, WorkspaceGuard, ReviewGuard)
  async retrieveReviewDetail(@ReqReview() review: Review) {
    return await this.reviewService.retrieveReviewDetail(review.id)
  }
}
