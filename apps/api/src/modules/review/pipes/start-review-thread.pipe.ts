import { CreateThreadDTO } from '../dtos/start-thread.dto'
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'

export type StartReviewThreadPipeOutput = Awaited<
  ReturnType<(typeof StartReviewThreadPipe)['prototype']['transform']>
>

@Injectable()
export class StartReviewThreadPipe implements PipeTransform {
  async transform(body: any) {
    const dto = plainToInstance(CreateThreadDTO, body)

    try {
      await validateOrReject(dto)
    } catch (err) {
      throw new BadRequestException(err)
    }

    return dto
  }
}
