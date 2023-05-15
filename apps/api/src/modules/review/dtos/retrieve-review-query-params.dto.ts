import { CreateThreadDTO } from './start-thread.dto'
import { PickType } from '@nestjs/mapped-types'

export class RetrieveReviewQueryParamsDTO extends PickType(CreateThreadDTO, [
  'pathname',
]) {}
