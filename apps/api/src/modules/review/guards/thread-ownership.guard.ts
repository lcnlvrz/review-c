import { THREAD_REQUEST_KEY } from './thread.guard'
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Thread, User } from 'database'
import { Request } from 'express'
import { AppError } from 'src/common/error'
import { USER_REQUEST_KEY } from 'src/modules/auth/guards/user.guard'

@Injectable()
export class ThreadOwnershipGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const thread: Thread = request[THREAD_REQUEST_KEY]
    const user: User = request[USER_REQUEST_KEY]

    if (thread.startedById !== user.id) {
      throw new ForbiddenException(
        new AppError({
          code: 'invalid_thread_ownership',
          description: `Thread with id ${thread.id} is not owned by user with id ${user.id}`,
          status: HttpStatus.FORBIDDEN,
        })
      )
    }

    return true
  }
}
