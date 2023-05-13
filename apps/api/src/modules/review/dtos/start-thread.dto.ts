import {
  IsArray,
  IsJWT,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator'
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

  @IsNumber()
  @Min(0)
  windowWidth: number

  @IsNumber()
  @Min(0)
  windowHeight: number
}

export interface ICreateThreadDTO extends CreateThreadDTO {}
