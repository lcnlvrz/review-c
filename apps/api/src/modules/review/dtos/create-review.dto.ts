import {
  IsEnum,
  IsJWT,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
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

  @ValidateIf((o: CreateReviewDTO) => o.type === ReviewType.WEBSITE)
  @IsString()
  @IsUrl()
  website: string
}
