import { AddMessageDTO } from './add-message.dto'
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'
import { StartThreadInput } from 'common'

export class CreateThreadDTO extends AddMessageDTO implements StartThreadInput {
  @IsNumber()
  xPercentage: number

  @IsNumber()
  yPercentage: number

  @IsString()
  xPath: string

  @IsNumber()
  @Min(0)
  windowWidth: number

  @IsNumber()
  @Min(0)
  windowHeight: number

  //TODO: validate pathname
  @IsString()
  @IsNotEmpty()
  pathname: string
}

export interface ICreateThreadDTO extends CreateThreadDTO {}
