import { Exclude, Expose } from 'class-transformer'
import { IsOptional, IsString, MaxLength } from 'class-validator'

@Exclude()
export class CreateWorkspaceDTO {
  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Name is too long' })
  name: string

  @Expose()
  @IsString()
  @IsOptional()
  description?: string
}
