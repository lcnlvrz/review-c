import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { PaginateReviewsInput } from 'common'

export class OffsetPaginationParamsDTO {
  @Min(1)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number = 1

  @IsString()
  @IsOptional()
  search?: string

  @Min(1)
  @Max(30)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number = 30
}

export class PaginateReviewsParamsDTO
  extends OffsetPaginationParamsDTO
  implements PaginateReviewsInput {}
