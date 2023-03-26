import { Transform, Type } from 'class-transformer'
import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsString,
  ValidateNested,
} from 'class-validator'
import { normalizeString } from 'src/utils/normalize-string'

class InvitationDTO {
  @Transform(({ value }) => normalizeString(value))
  @IsEmail()
  @IsString()
  email: string
}

export class InviteGuestsToWorkspaceDTO {
  @ValidateNested({ each: true })
  @Type(() => InvitationDTO)
  @ArrayUnique()
  @IsArray()
  invitations: InvitationDTO[]
}

export interface IInviteGuestsToWorkspaceDTO
  extends InviteGuestsToWorkspaceDTO {}
