import {
  IsEnum,
  IsJWT,
  IsString,
  ValidateIf,
  IsUrl,
  MaxLength,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator'
import { CreateReviewInput } from 'common'
import { ReviewType } from 'database'

export class CreateReviewDTO implements CreateReviewInput {
  @IsString()
  @MaxLength(255)
  title: string

  @IsString()
  @IsEnum(Object.keys(ReviewType))
  type: ReviewType

  @ValidateIf((o: CreateReviewDTO) => o.type === ReviewType.FILE)
  @IsString()
  @IsJWT()
  file: string

  @ValidateIf((o: CreateReviewDTO) => o.type === ReviewType.URL)
  @IsString()
  @IsUrl()
  url: string
}
