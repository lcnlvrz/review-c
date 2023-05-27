import { Exclude, Expose } from 'class-transformer'
import { IsString } from 'class-validator'

@Exclude()
export class ReviewParamDTO {
  @Expose()
  @IsString()
  reviewId: string
}
