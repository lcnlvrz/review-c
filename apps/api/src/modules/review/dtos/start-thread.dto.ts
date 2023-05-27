import { AddMessageDTO } from './add-message.dto'
import { Exclude, Expose, Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator'
import { StartThreadInput } from 'common'
import { MarkerType, Point, Selection } from 'database'

@Exclude()
class SelectionDTO implements Omit<Selection, 'id'> {
  @Expose()
  @IsString()
  startContainerXPath: string

  @Expose()
  @IsNumber()
  startOffset: number

  @Expose()
  @IsNumber()
  startChildrenNodeIndex: number

  @Expose()
  @IsNumber()
  endChildrenNodeIndex: number

  @Expose()
  @IsNumber()
  endOffset: number

  @Expose()
  @IsString()
  endContainerXPath: string
}

@Exclude()
class PointDTO implements Omit<Point, 'id'> {
  @Expose()
  @IsString()
  xPath: string

  @Expose()
  @IsNumber()
  xPercentage: number

  @Expose()
  @IsNumber()
  yPercentage: number
}

@Exclude()
export class CreateThreadDTO extends AddMessageDTO implements StartThreadInput {
  @Expose()
  @IsEnum(Object.keys(MarkerType))
  @IsString()
  type: MarkerType

  @Expose()
  @ValidateIf((object: CreateThreadDTO) => object?.type === 'point')
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => PointDTO)
  point: PointDTO

  @Expose()
  @ValidateIf((object: CreateThreadDTO) => object?.type === 'selection')
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => SelectionDTO)
  selection: SelectionDTO

  @Expose()
  @IsNumber()
  @Min(0)
  windowWidth: number

  @Expose()
  @IsNumber()
  @Min(0)
  windowHeight: number

  @Expose()
  @IsString()
  @IsNotEmpty()
  pathname: string
}

export interface ICreateThreadDTO extends CreateThreadDTO {}
