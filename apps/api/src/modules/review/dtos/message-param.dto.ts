import { Exclude, Expose, Transform } from 'class-transformer'
import { IsNumber } from 'class-validator'

@Exclude()
export class MessageParamDTO {
  @Expose()
  @IsNumber()
  @Transform((obj) => Number(obj.value))
  messageId: number
}
