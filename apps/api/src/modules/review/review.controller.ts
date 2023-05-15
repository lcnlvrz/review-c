import { ReqUser } from '../auth/decorators/user.decorator'
import { UserGuard } from '../auth/guards/user.guard'
import { ReqWorkspace } from '../workspace/decorators/workspace.decorator'
import { WorkspaceGuard } from '../workspace/guards/workspace.guard'
import { ReqReview } from './decorators/review.decorator'
import { AddMessageDTO } from './dtos/add-message.dto'
import { ListReviewsQueryParamsDTO } from './dtos/list-reviews-query-params.dto'
import { RetrieveReviewQueryParamsDTO } from './dtos/retrieve-review-query-params.dto'
import { CreateThreadDTO } from './dtos/start-thread.dto'
import { MessageOwnershipGuard } from './guards/message-ownership.guard'
import { MessageGuard, ReqMessage } from './guards/message.guard'
import { ReviewOriginGuard } from './guards/review-origin.guard'
import { ReviewGuard } from './guards/review.guard'
import { ThreadOwnershipGuard } from './guards/thread-ownership.guard'
import { ReqThread, ThreadGuard } from './guards/thread.guard'
import {
  CreateReviewPipe,
  CreateReviewPipeOutput,
} from './pipes/create-review.pipe'
import { ReviewService } from './review.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { Message, Review, Thread, User, Workspace } from 'database'
import {
  FileTokenClaims,
  FileTokensGuard,
  ReqFileTokensClaims,
} from 'src/common/guards/file-tokens.guard'

@Controller('workspace')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':workspaceId/review/:reviewId/thread')
  @UseGuards(
    UserGuard,
    WorkspaceGuard,
    ReviewGuard,
    FileTokensGuard,
    ReviewOriginGuard
  )
  async addThreadToReview(
    @ReqFileTokensClaims() files: FileTokenClaims[],
    @Body() dto: CreateThreadDTO,
    @ReqUser() user: User,
    @ReqWorkspace() workspace: Workspace,
    @ReqReview() review: Review,
    @Headers('user-agent') userAgent: string,
    @Headers('origin') origin: string
  ) {
    return await this.reviewService.startThread({
      origin,
      files,
      userAgent,
      dto,
      review,
      user,
      workspace,
    })
  }

  @Delete(':workspaceId/review/:reviewId/thread/:threadId')
  @UseGuards(
    UserGuard,
    WorkspaceGuard,
    ReviewGuard,
    ThreadGuard,
    ThreadOwnershipGuard
  )
  async deleteThread(@ReqThread() thread: Thread) {
    return await this.reviewService.deleteThread({
      thread,
    })
  }

  @Delete(':workspaceId/review/:reviewId/thread/:threadId/message/:messageId')
  @UseGuards(
    UserGuard,
    WorkspaceGuard,
    ReviewGuard,
    ThreadGuard,
    ThreadOwnershipGuard,
    MessageGuard,
    MessageOwnershipGuard
  )
  async deleteMessageFromThread(@ReqMessage() message: Message) {
    return await this.reviewService.deleteMessageFromThread({
      message,
    })
  }

  @Put(':workspaceId/review/:reviewId/thread/:threadId/message/:messageId')
  @UseGuards(
    UserGuard,
    WorkspaceGuard,
    ReviewGuard,
    FileTokensGuard,
    ThreadGuard,
    ThreadOwnershipGuard,
    MessageGuard,
    MessageOwnershipGuard
  )
  async updateMessage(
    @ReqFileTokensClaims() files: FileTokenClaims[],
    @ReqMessage() message: Message,
    @Body() dto: AddMessageDTO
  ) {
    return await this.reviewService.updateMessage({
      dto,
      files,
      message,
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
  async listReviews(
    @ReqWorkspace() workspace: Workspace,
    @Query() query: ListReviewsQueryParamsDTO
  ) {
    return await this.reviewService.listReviews({
      workspace,
      query,
    })
  }

  @Get(':workspaceId/review/:reviewId')
  @UseGuards(UserGuard, WorkspaceGuard, ReviewGuard)
  async retrieveReviewDetail(
    @ReqReview() review: Review,
    @Query() query: RetrieveReviewQueryParamsDTO
  ) {
    return await this.reviewService.retrieveReviewDetail({
      reviewId: review.id,
      pathname: query.pathname,
    })
  }
}
