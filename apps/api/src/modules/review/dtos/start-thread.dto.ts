import { IsArray, IsJWT, IsNumber, IsString, Max, Min } from 'class-validator'
import { StartThreadInput } from 'common'

export class CreateThreadDTO implements StartThreadInput {
  @IsNumber()
  @Min(0)
  @Max(100)
  xPercentage: number

  @IsNumber()
  @Min(0)
  @Max(100)
  yPercentage: number

  @IsString()
  xPath: string

  @IsString()
  message: string

  @IsArray()
  @IsString({ each: true })
  @IsJWT({ each: true })
  files: string[] = []
}

export interface ICreateThreadDTO extends CreateThreadDTO {}
