import { Exclude, Expose } from 'class-transformer'
import { IsOptional, IsString, IsUrl } from 'class-validator'

@Exclude()
export class ListReviewsQueryParamsDTO {
  @Expose()
  @IsUrl()
  @IsOptional()
  @IsString()
  website?: string
}
