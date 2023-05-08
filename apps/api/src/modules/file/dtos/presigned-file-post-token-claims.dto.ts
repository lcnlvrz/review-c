import { IsString } from 'class-validator'

export class PresignedFilePostTokenClaimsDTO {
  @IsString()
  storedKey: string

  @IsString()
  originalFilename: string
}
