import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { map } from 'rxjs'
import { AppError } from './error'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      map((data: unknown) => {
        if (data instanceof AppError) {
          throw new HttpException(data, data.status)
        }

        return data
      })
    )
  }
}
