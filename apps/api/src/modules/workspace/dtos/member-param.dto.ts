import { Transform } from 'class-transformer'
import { IsNumber, Min } from 'class-validator'

export class MemberParamDTO {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value as string))
  memberId: number
}
