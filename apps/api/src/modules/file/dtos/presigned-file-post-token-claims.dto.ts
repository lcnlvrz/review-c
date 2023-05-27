import { Exclude, Expose } from 'class-transformer'
import { IsString } from 'class-validator'

@Exclude()
export class PresignedFilePostTokenClaimsDTO {
  @Expose()
  @IsString()
  storedKey: string

  @Expose()
  @IsString()
  originalFilename: string
}
