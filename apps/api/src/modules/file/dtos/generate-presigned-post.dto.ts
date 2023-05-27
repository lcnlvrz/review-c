import { Exclude, Expose } from 'class-transformer'
import { IsMimeType, IsString } from 'class-validator'

@Exclude()
export class GeneratePresignedPostDTO {
  @Expose()
  @IsString()
  @IsMimeType()
  mimetype: string

  @Expose()
  @IsString()
  filename: string
}
