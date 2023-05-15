import { IsOptional, IsString, IsUrl } from 'class-validator'

export class ListReviewsQueryParamsDTO {
  @IsUrl()
  @IsOptional()
  @IsString()
  website?: string
}
