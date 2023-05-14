import { AddMessageDTO } from './add-message.dto'
import { IsNumber, IsString, Max, Min } from 'class-validator'
import { StartThreadInput } from 'common'

export class CreateThreadDTO extends AddMessageDTO implements StartThreadInput {
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

  @IsNumber()
  @Min(0)
  windowWidth: number

  @IsNumber()
  @Min(0)
  windowHeight: number
}

export interface ICreateThreadDTO extends CreateThreadDTO {}
