import { IsString } from 'class-validator'

export class InvitationParamDTO {
  @IsString()
  invitationId: string
}
