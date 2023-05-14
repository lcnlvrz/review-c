import { IsString, IsArray, IsJWT } from 'class-validator'
import { AddMessageToThreadInput } from 'common'

export class AddMessageDTO implements AddMessageToThreadInput {
  @IsString()
  message: string

  @IsArray()
  @IsString({ each: true })
  @IsJWT({ each: true })
  files: string[] = []
}
