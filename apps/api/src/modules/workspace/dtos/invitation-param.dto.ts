import { Transform } from 'class-transformer'
import { IsNumber, Min } from 'class-validator'

export class InvitationParamDTO {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value as string))
  invitationId: number
}
