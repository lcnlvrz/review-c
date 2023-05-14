import { ReqUser } from '../auth/decorators/user.decorator'
import { UserGuard } from '../auth/guards/user.guard'
import { ReqWorkspace } from '../workspace/decorators/workspace.decorator'
import { WorkspaceGuard } from '../workspace/guards/workspace.guard'
import { ReqReview } from './decorators/review.decorator'
import { AddMessageDTO } from './dtos/add-message.dto'
import { CreateThreadDTO } from './dtos/start-thread.dto'
import { ReviewGuard } from './guards/review.guard'
import { ReqThread, ThreadGuard } from './guards/thread.guard'
import {
  CreateReviewPipe,
  CreateReviewPipeOutput,
} from './pipes/create-review.pipe'
import { ReviewService } from './review.service'
import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common'
import { Review, Thread, User, Workspace } from 'database'
import {
  FileTokenClaims,
  FileTokensGuard,
  ReqFileTokensClaims,
} from 'src/common/guards/file-tokens.guard'

@Controller('workspace')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':workspaceId/review/:reviewId/thread')
  @UseGuards(UserGuard, WorkspaceGuard, ReviewGuard, FileTokensGuard)
  async addThreadToReview(
    @ReqFileTokensClaims() files: FileTokenClaims[],
    @Body() dto: CreateThreadDTO,
    @ReqUser() user: User,
    @ReqWorkspace() workspace: Workspace,
    @ReqReview() review: Review,
    @Headers('user-agent') userAgent: string
  ) {
    return await this.reviewService.startThread({
      files,
      userAgent,
      dto,
      review,
      user,
      workspace,
    })
  }

  @Post(':workspaceId/review/:reviewId/thread/:threadId/message')
  @UseGuards(
    UserGuard,
    WorkspaceGuard,
    ReviewGuard,
    FileTokensGuard,
    ThreadGuard
  )
  async addMessageToThread(
    @ReqFileTokensClaims() files: FileTokenClaims[],
    @Body() dto: AddMessageDTO,
    @ReqUser() user: User,
    @ReqThread() thread: Thread
  ) {
    return await this.reviewService.addMessageToThread({
      dto,
      files,
      thread,
      user,
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
