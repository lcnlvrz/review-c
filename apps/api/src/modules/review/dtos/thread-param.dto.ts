import { Transform } from 'class-transformer'
import { IsNumber, IsNumberString } from 'class-validator'

export class ThreadParamDTO {
  @IsNumber()
  @Transform((obj) => Number(obj.value))
  threadId: number
}
