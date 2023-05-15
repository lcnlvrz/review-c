import { MESSAGE_REQUEST_KEY } from './message.guard'
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Message, User } from 'database'
import { Request } from 'express'
import { AppError } from 'src/common/error'
import { USER_REQUEST_KEY } from 'src/modules/auth/guards/user.guard'

@Injectable()
export class MessageOwnershipGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const message: Message = request[MESSAGE_REQUEST_KEY]
    const user: User = request[USER_REQUEST_KEY]

    if (message.sentById !== user.id) {
      throw new ForbiddenException(
        new AppError({
          code: 'invalid_message_ownership',
          description: `Message with id ${message.id} does not belong to user with id ${user.id}`,
          status: HttpStatus.FORBIDDEN,
        })
      )
    }

    return true
  }
}
