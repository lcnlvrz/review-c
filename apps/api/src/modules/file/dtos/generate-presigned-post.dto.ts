import { IsMimeType, IsString } from 'class-validator'

export class GeneratePresignedPostDTO {
  @IsString()
  @IsMimeType()
  mimetype: string

  @IsString()
  filename: string
}
