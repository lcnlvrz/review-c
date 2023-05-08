import { ReviewParamDTO } from '../dtos/review-param.dto'
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { Workspace } from 'database'
import { Request } from 'express'
import { AppError } from 'src/common/error'
import { DatabaseService } from 'src/modules/database/database.service'
import { WORKSPACE_REQUEST_KEY } from 'src/modules/workspace/guards/workspace-member-role.guard'

export const REVIEW_REQUEST_KEY = 'review'

@Injectable()
export class ReviewGuard implements CanActivate {
  constructor(private readonly dbService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const params = plainToInstance(ReviewParamDTO, request.params)

    try {
      await validateOrReject(params)
    } catch (err) {
      throw new BadRequestException(err)
    }

    const workspace: Workspace = request[WORKSPACE_REQUEST_KEY]

    const review = await this.dbService.review.findFirst({
      where: {
        id: params.reviewId,
        workspaceId: workspace.id,
      },
    })

    console.log('review', review)

    if (!review) {
      throw new NotFoundException(
        new AppError({
          code: 'not_found_review',
          description: `Review with id ${params.reviewId} not found`,
          status: HttpStatus.NOT_FOUND,
        })
      )
    }

    request[REVIEW_REQUEST_KEY] = review

    return true
  }
}
