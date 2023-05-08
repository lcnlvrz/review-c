import { IsString } from 'class-validator'

export class ReviewParamDTO {
  @IsString()
  reviewId: string
}
