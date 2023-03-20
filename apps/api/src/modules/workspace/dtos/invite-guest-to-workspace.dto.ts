import { IsEmail } from 'class-validator'

export class InviteGuestToWorkspaceDTO {
  @IsEmail()
  email: string
}
