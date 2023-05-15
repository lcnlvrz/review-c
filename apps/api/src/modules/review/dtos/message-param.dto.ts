import { Transform } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class MessageParamDTO {
  @IsNumber()
  @Transform((obj) => Number(obj.value))
  messageId: number
}
