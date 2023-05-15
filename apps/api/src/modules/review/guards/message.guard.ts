import { MessageParamDTO } from '../dtos/message-param.dto'
import { THREAD_REQUEST_KEY } from './thread.guard'
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
import { Thread } from 'database'
import { Request } from 'express'
import { AppError } from 'src/common/error'
import { DatabaseService } from 'src/modules/database/database.service'

export const MESSAGE_REQUEST_KEY = 'message'

export const ReqMessage = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    return request[MESSAGE_REQUEST_KEY]
  }
)

@Injectable()
export class MessageGuard implements CanActivate {
  constructor(private readonly dbService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const thread: Thread = request[THREAD_REQUEST_KEY]
    const params = plainToInstance(MessageParamDTO, request.params)

    try {
      await validateOrReject(params)
    } catch (err) {
      throw new BadRequestException(err)
    }

    const message = await this.dbService.message.findFirst({
      where: {
        id: params.messageId,
        threads: {
          some: {
            id: thread.id,
          },
        },
      },
    })

    if (!message) {
      throw new NotFoundException(
        new AppError({
          code: 'not_found_message',
          description: `message with id ${params.messageId} not found`,
          status: HttpStatus.NOT_FOUND,
        })
      )
    }

    request[MESSAGE_REQUEST_KEY] = message

    return true
  }
}
