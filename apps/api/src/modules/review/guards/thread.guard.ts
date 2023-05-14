import { ThreadParamDTO } from '../dtos/thread-param.dto'
import { REVIEW_REQUEST_KEY } from './review.guard'
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { Review } from 'database'
import { Request } from 'express'
import { AppError } from 'src/common/error'
import { DatabaseService } from 'src/modules/database/database.service'

export const THREAD_REQUEST_KEY = 'thread'

export const ReqThread = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    return request[THREAD_REQUEST_KEY]
  }
)

@Injectable()
export class ThreadGuard implements CanActivate {
  constructor(private readonly dbService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const review: Review = request[REVIEW_REQUEST_KEY]
    const params = plainToInstance(ThreadParamDTO, request.params)

    try {
      await validateOrReject(params)
    } catch (err) {
      throw new BadRequestException(err)
    }

    const thread = await this.dbService.thread.findFirst({
      where: {
        id: params.threadId,
        reviewId: review.id,
      },
    })

    if (!thread) {
      throw new NotFoundException(
        new AppError({
          code: 'not_found_thread',
          description: `Thread with id ${params.threadId} not found`,
          status: HttpStatus.NOT_FOUND,
        })
      )
    }

    request[THREAD_REQUEST_KEY] = thread

    return true
  }
}
