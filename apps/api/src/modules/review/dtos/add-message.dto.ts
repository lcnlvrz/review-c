import { Exclude, Expose } from 'class-transformer'
import { IsString, IsArray, IsJWT } from 'class-validator'
import { AddMessageToThreadInput } from 'common'

@Exclude()
export class AddMessageDTO implements AddMessageToThreadInput {
  @Expose()
  @IsString()
  message: string

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsJWT({ each: true })
  files: string[] = []
}
