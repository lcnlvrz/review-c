import { Exclude, Expose, Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { PaginateReviewsInput } from 'common'

@Exclude()
export class OffsetPaginationParamsDTO {
  @Expose()
  @Min(1)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number = 1

  @Expose()
  @IsString()
  @IsOptional()
  search?: string

  @Expose()
  @Min(1)
  @Max(30)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number = 30
}

export class PaginateReviewsParamsDTO
  extends OffsetPaginationParamsDTO
  implements PaginateReviewsInput {}
