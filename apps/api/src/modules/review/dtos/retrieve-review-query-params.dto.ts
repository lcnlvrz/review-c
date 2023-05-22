import { CreateThreadDTO } from './start-thread.dto'
import { PartialType, PickType } from '@nestjs/mapped-types'

export class RetrieveReviewQueryParamsDTO extends PartialType(
  PickType(CreateThreadDTO, ['pathname'])
) {}
