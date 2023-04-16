import { IsNumber, IsString } from 'class-validator'

export class PresignedFilePostTokenClaimsDTO {
  @IsString()
  keyStored: string

  @IsString()
  originalFilename: string
}
