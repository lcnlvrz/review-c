import { IsNumber, Min } from 'class-validator'

export class InvitationParamDTO {
  @IsNumber()
  @Min(1)
  invitationId: number
}
